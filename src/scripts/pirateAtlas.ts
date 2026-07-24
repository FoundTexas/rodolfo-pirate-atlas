import * as THREE from 'three';

const shell = document.querySelector<HTMLElement>('[data-atlas-shell]');
const canvas = document.querySelector<HTMLCanvasElement>('[data-atlas-canvas]');
const fallback = document.querySelector<HTMLElement>('[data-atlas-fallback]');

if (shell && canvas && !canvas.dataset.ready) {
  canvas.dataset.ready = 'true';
  try {
    if (fallback) fallback.hidden = true;
    initAtlas(shell, canvas);
  } catch (error) {
    console.error('The atlas could not be initialized.', error);
    canvas.hidden = true;
    if (fallback) fallback.hidden = false;
    shell.classList.add('atlas-unavailable');
  }
}

function initAtlas(shell: HTMLElement, canvas: HTMLCanvasElement) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileViewport = window.matchMedia('(max-width: 991.98px)');
  const coarsePointer = window.matchMedia('(pointer: coarse)');
  const isMobile = window.matchMedia('(max-width: 760px)').matches;
  const isCoarse = coarsePointer.matches;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.2 : 1.7));
  renderer.shadowMap.enabled = !isMobile;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  // This build uses only a virtual joystick on touch/small-screen devices.
  shell.querySelectorAll<HTMLElement>('.atlas-touch-controls, [data-atlas-touch-controls], [data-atlas-direction-controls], .atlas-dpad, .mobile-arrow-controls').forEach((legacyControls) => legacyControls.remove());
  const syncMobileControlMode = () => {
    shell.classList.toggle('use-joystick', mobileViewport.matches || coarsePointer.matches);
  };
  syncMobileControlMode();
  mobileViewport.addEventListener?.('change', syncMobileControlMode);
  coarsePointer.addEventListener?.('change', syncMobileControlMode);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07141c, 0.021);

  const camera = new THREE.PerspectiveCamera(51, 1, 0.1, 160);
  camera.position.set(0, 15.2, 27);

  const world = new THREE.Group();
  scene.add(world);

  const ambient = new THREE.HemisphereLight(0x9bd9ff, 0x051017, 1.55);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xffe8b0, 3.05);
  sun.position.set(-7, 13, 8);
  sun.castShadow = !isMobile;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -16;
  sun.shadow.camera.right = 16;
  sun.shadow.camera.top = 16;
  sun.shadow.camera.bottom = -16;
  scene.add(sun);

  const seaGeometry = new THREE.PlaneGeometry(72, 72, isMobile ? 30 : 54, isMobile ? 30 : 54);
  const seaMaterial = new THREE.MeshStandardMaterial({
    color: 0x0b4355,
    roughness: 0.25,
    metalness: 0.18,
    transparent: true,
    opacity: 0.94,
    side: THREE.DoubleSide
  });
  const sea = new THREE.Mesh(seaGeometry, seaMaterial);
  sea.rotation.x = -Math.PI / 2;
  sea.position.y = -0.56;
  sea.receiveShadow = true;
  world.add(sea);
  const seaPositions = seaGeometry.attributes.position as THREE.BufferAttribute;
  const seaBase = new Float32Array(seaPositions.array as ArrayLike<number>);

  const compass = createCompass();
  compass.position.y = -0.49;
  world.add(compass);

  const stars = createStars(isMobile ? 280 : 620);
  scene.add(stars);

  const routes = new THREE.Group();
  world.add(routes);

  const islandData = [
    { slug: 'sas-consulting-work', title: 'SAS Viya Consulting Work', position: [-5.4, 0, -2.2], color: 0x49d9c3, scale: 1.18, shoreRadius: 1.62 },
    { slug: 'gbm-cloud-backend', title: 'Cloud-Native Financial Backend', position: [-1.7, 0, -5.4], color: 0xffb44a, scale: 1.08, shoreRadius: 1.48 },
    { slug: 'web-applications', title: 'Web Applications & Client Sites', position: [5.1, 0, -0.9], color: 0xf1d36d, scale: 1.22, shoreRadius: 1.68 },
    { slug: 'foundtexas-interactive-worlds', title: 'FoundTexas Interactive Worlds', position: [-0.7, 0, 5.2], color: 0xf369c8, scale: 1.2, shoreRadius: 1.65 }
  ] as const;

  const islands = new Map<string, THREE.Group>();
  const interactiveMeshes: THREE.Object3D[] = [];
  islandData.forEach((data, index) => {
    const island = createIsland(data.slug, data.color, data.scale, index);
    island.position.set(
      data.position[0],
      data.position[1],
      data.position[2]
    );
    island.userData.restScale = data.scale;
    world.add(island);
    islands.set(data.slug, island);
    island.traverse((child: THREE.Object3D) => {
      child.userData.slug = data.slug;
      interactiveMeshes.push(child);
    });
    const next = islandData[(index + 1) % islandData.length];
    routes.add(
      createRoute(
        new THREE.Vector3(
          data.position[0],
          data.position[1],
          data.position[2]
        ),
        new THREE.Vector3(
          next.position[0],
          next.position[1],
          next.position[2]
        ),
        data.color
      )
    );
  });

  const ship = createPandaShip();
  ship.position.set(0, -0.28, 0.25);
  world.add(ship);

  const hero = shell.closest<HTMLElement>('.hero');
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(0, 0);
  const pointerSmooth = new THREE.Vector2(0, 0);
  let previousFrameTime = performance.now();
  let elapsed = 0;
  const cameraTarget = new THREE.Vector3();
  const desiredCamera = new THREE.Vector3();
  const keys = new Set<string>();
  const joystickInput = { throttle: 0, turn: 0 };
  const labels = Array.from(shell.querySelectorAll<HTMLElement>('[data-project-label]'));
  const playButton = shell.querySelector<HTMLButtonElement>('#atlas-play');
  const fullscreenButton = shell.querySelector<HTMLButtonElement>('#atlas-fullscreen');
  const helpPanel = shell.querySelector<HTMLElement>('#atlas-help');
  const helpClose = shell.querySelector<HTMLButtonElement>('#atlas-help-close');
  const playLabel = shell.querySelector<HTMLElement>('[data-play-label]');
  const status = shell.querySelector<HTMLElement>('#atlas-status');
  const speedReadout = shell.querySelector<HTMLElement>('[data-atlas-speed]');
  const joystick = shell.querySelector<HTMLElement>('[data-atlas-joystick]');
  const joystickBase = shell.querySelector<HTMLElement>('[data-joystick-base]');
  const joystickKnob = shell.querySelector<HTMLElement>('[data-joystick-knob]');
  const dockingNotice = shell.querySelector<HTMLElement>('#atlas-docking-notice');
  const dockingTitle = shell.querySelector<HTMLElement>('[data-docking-title]');

  let exploreMode = false;
  let hoveredSlug = '';
  let scrollProgress = 0;
  let boatHeading = Math.PI;
  let cameraDistanceOffset = 0;
  let currentSpeed = 0;
  let joystickPointerId: number | null = null;
  let dockingSlug = '';
  let dragState: {
    pointerId: number;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    moved: boolean;
    islandSlug: string;
  } | null = null;

  const dragInput = { throttle: 0, turn: 0 };

  function setExploreMode(next: boolean) {
    exploreMode = next;
    playButton?.setAttribute('aria-pressed', String(next));
    shell.classList.toggle('is-exploring', next);
    hero?.classList.toggle('is-exploring', next);
    if (playLabel) playLabel.textContent = next ? 'Leave explore mode' : 'Explore the sea';
    if (status) {
      status.textContent = next
        ? (shell.classList.contains('use-joystick') ? 'Use the joystick and sail into an island to dock.' : 'W/↑ advance · S/↓ reverse · A/D turn · sail into an island to dock.')
        : 'Open explore mode to steer the panda, or select an island directly.';
    }
    if (helpPanel) helpPanel.hidden = !next || shell.classList.contains('use-joystick');
    if (joystick) {
      const joystickVisible = next && shell.classList.contains('use-joystick');
      joystick.setAttribute('aria-hidden', String(!joystickVisible));
    }
    if (next) {
      requestAnimationFrame(() => canvas.focus({ preventScroll: true }));
    } else {
      keys.clear();
      joystickInput.throttle = 0;
      joystickInput.turn = 0;
      joystickPointerId = null;
      joystickKnob?.style.setProperty('transform', 'translate3d(0, 0, 0)');
      dragState = null;
      dragInput.throttle = 0;
      dragInput.turn = 0;
      currentSpeed = 0;
      dockingSlug = '';
      shell.classList.remove('is-docking');
      if (dockingNotice) dockingNotice.hidden = true;
    }
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement === shell) {
        await document.exitFullscreen();
      } else {
        setExploreMode(true);
        await shell.requestFullscreen();
      }
    } catch (error) {
      console.warn('Fullscreen is not available in this browser.', error);
    }
  }

  function adjustZoom(amount: number) {
    cameraDistanceOffset = THREE.MathUtils.clamp(cameraDistanceOffset + amount, -3, 11);
    if (status) status.textContent = `Camera distance ${Math.round(cameraDistanceOffset + 10)} · use the mouse wheel to adjust.`;
  }

  playButton?.addEventListener('click', () => setExploreMode(!exploreMode));
  helpClose?.addEventListener('click', () => {
    if (helpPanel) helpPanel.hidden = true;
    canvas.focus({ preventScroll: true });
  });
  fullscreenButton?.addEventListener('click', toggleFullscreen);

  document.addEventListener('fullscreenchange', () => {
    const active = document.fullscreenElement === shell;
    shell.classList.toggle('is-fullscreen', active);
    if (fullscreenButton) {
      fullscreenButton.textContent = active ? '×' : '⛶';
      fullscreenButton.setAttribute('aria-label', active ? 'Exit fullscreen' : 'Open atlas in fullscreen');
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.code === 'KeyF' && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      void toggleFullscreen();
      return;
    }
    const controlKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (exploreMode && controlKeys.includes(event.code)) {
      event.preventDefault();
      keys.add(event.code);
    }
  });
  window.addEventListener('keyup', (event) => keys.delete(event.code));

  function updatePointer(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function getIslandAtPointer() {
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(interactiveMeshes, false)[0];
    return (hit?.object.userData.slug as string | undefined) ?? '';
  }

  canvas.addEventListener('pointermove', (event) => {
    updatePointer(event);
    if (dragState && dragState.pointerId === event.pointerId && exploreMode && !isCoarse) {
      dragState.currentX = event.clientX;
      dragState.currentY = event.clientY;
      const dx = dragState.currentX - dragState.startX;
      const dy = dragState.currentY - dragState.startY;
      dragState.moved ||= Math.hypot(dx, dy) > 8;
      dragInput.turn = THREE.MathUtils.clamp(-dx / 90, -1, 1);
      dragInput.throttle = THREE.MathUtils.clamp(-dy / 90, -1, 1);
      canvas.style.cursor = 'grabbing';
    }
  });

  canvas.addEventListener('pointerdown', (event) => {
    updatePointer(event);
    const islandSlug = getIslandAtPointer();
    dragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      currentX: event.clientX,
      currentY: event.clientY,
      moved: false,
      islandSlug
    };
    canvas.setPointerCapture(event.pointerId);
  });

  function finishPointer(event: PointerEvent) {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    const shouldOpenIsland = !dragState.moved && Boolean(dragState.islandSlug);
    const islandSlug = dragState.islandSlug;
    dragState = null;
    dragInput.throttle = 0;
    dragInput.turn = 0;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    if (shouldOpenIsland) window.location.href = `/projects/${islandSlug}/`;
  }

  canvas.addEventListener('pointerup', finishPointer);
  canvas.addEventListener('pointercancel', finishPointer);
  canvas.addEventListener('pointerleave', () => {
    if (!dragState) pointer.set(0, 0);
  });
  canvas.addEventListener('wheel', (event) => {
    if (!exploreMode && document.fullscreenElement !== shell) return;
    event.preventDefault();
    adjustZoom(Math.sign(event.deltaY) * 0.8);
  }, { passive: false });

  function updateJoystick(event: PointerEvent) {
    if (!joystickBase || !joystickKnob) return;
    const rect = joystickBase.getBoundingClientRect();
    const maxRadius = Math.max(24, rect.width * 0.34);
    let dx = event.clientX - (rect.left + rect.width / 2);
    let dy = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.hypot(dx, dy);
    if (distance > maxRadius) {
      const ratio = maxRadius / distance;
      dx *= ratio;
      dy *= ratio;
    }
    joystickInput.turn = THREE.MathUtils.clamp(dx / maxRadius, -1, 1);
    joystickInput.throttle = THREE.MathUtils.clamp(-dy / maxRadius, -1, 1);
    joystickKnob.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
  }

  function releaseJoystick(event?: PointerEvent) {
    if (event && joystickPointerId !== event.pointerId) return;
    if (event && joystickBase?.hasPointerCapture(event.pointerId)) joystickBase.releasePointerCapture(event.pointerId);
    joystickPointerId = null;
    joystickInput.throttle = 0;
    joystickInput.turn = 0;
    joystickKnob?.style.setProperty('transform', 'translate3d(0, 0, 0)');
    joystick?.classList.remove('is-active');
  }

  joystickBase?.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    if (!exploreMode) setExploreMode(true);
    joystickPointerId = event.pointerId;
    joystickBase.setPointerCapture(event.pointerId);
    joystick?.classList.add('is-active');
    updateJoystick(event);
  });
  joystickBase?.addEventListener('pointermove', (event) => {
    if (joystickPointerId !== event.pointerId) return;
    event.preventDefault();
    updateJoystick(event);
  });
  joystickBase?.addEventListener('pointerup', releaseJoystick);
  joystickBase?.addEventListener('pointercancel', releaseJoystick);
  joystickBase?.addEventListener('lostpointercapture', () => releaseJoystick());
  joystickBase?.addEventListener('contextmenu', (event) => event.preventDefault());


  window.addEventListener('scroll', () => {
    const heroHeight = Math.max(hero?.offsetHeight ?? window.innerHeight, 1);
    scrollProgress = THREE.MathUtils.clamp(window.scrollY / heroHeight, 0, 1);
  }, { passive: true });

  function resize() {
    const rect = shell.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / Math.max(rect.height, 1);
    camera.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(shell);
  resize();

  function updateSea(time: number) {
    if (reducedMotion) return;
    for (let i = 0; i < seaPositions.count; i += 1) {
      const baseX = seaBase[i * 3];
      const baseY = seaBase[i * 3 + 1];
      seaPositions.setZ(i,
        Math.sin(baseX * 0.42 + time * 0.9) * 0.12 +
        Math.cos(baseY * 0.32 + time * 0.65) * 0.08
      );
    }
    seaPositions.needsUpdate = true;
  }

  const shipCollisionRadius = 0.72;
  const collisionStart = new THREE.Vector2();
  const collisionEnd = new THREE.Vector2();
  const collisionCenter = new THREE.Vector2();
  const collisionSegment = new THREE.Vector2();
  const collisionToCenter = new THREE.Vector2();
  const collisionClosest = new THREE.Vector2();

  function segmentIntersectsIsland(
    previousPosition: THREE.Vector3,
    currentPosition: THREE.Vector3,
    islandX: number,
    islandZ: number,
    radius: number
  ) {
    collisionStart.set(previousPosition.x, previousPosition.z);
    collisionEnd.set(currentPosition.x, currentPosition.z);
    collisionCenter.set(islandX, islandZ);
    collisionSegment.subVectors(collisionEnd, collisionStart);
    collisionToCenter.subVectors(collisionCenter, collisionStart);

    const segmentLengthSquared = collisionSegment.lengthSq();
    const progress = segmentLengthSquared > 0
      ? THREE.MathUtils.clamp(collisionToCenter.dot(collisionSegment) / segmentLengthSquared, 0, 1)
      : 0;

    collisionClosest.copy(collisionStart).addScaledVector(collisionSegment, progress);
    return collisionClosest.distanceToSquared(collisionCenter) <= radius * radius;
  }

  function beginDocking(island: (typeof islandData)[number]) {
    if (dockingSlug) return;
    dockingSlug = island.slug;
    currentSpeed = 0;
    keys.clear();
    joystickInput.throttle = 0;
    joystickInput.turn = 0;
    dragInput.throttle = 0;
    dragInput.turn = 0;
    releaseJoystick();

    // Keep the boat on the visible shoreline instead of allowing it to pass through the island.
    const awayFromIsland = new THREE.Vector2(
      ship.position.x - island.position[0],
      ship.position.z - island.position[2]
    );
    if (awayFromIsland.lengthSq() < 0.0001) {
      awayFromIsland.set(-Math.sin(boatHeading), -Math.cos(boatHeading));
    }
    awayFromIsland.normalize().multiplyScalar(island.shoreRadius + shipCollisionRadius - 0.06);
    ship.position.x = island.position[0] + awayFromIsland.x;
    ship.position.z = island.position[2] + awayFromIsland.y;

    shell.classList.add('is-docking');
    if (status) status.textContent = `Docking at ${island.title}…`;
    if (dockingTitle) dockingTitle.textContent = island.title;
    if (dockingNotice) dockingNotice.hidden = false;

    window.setTimeout(() => {
      window.location.assign(`/projects/${island.slug}/`);
    }, 680);
  }

  function checkIslandCollision(previousPosition: THREE.Vector3) {
    if (!exploreMode || dockingSlug) return;

    let closestIsland: (typeof islandData)[number] | null = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const island of islandData) {
      const dx = ship.position.x - island.position[0];
      const dz = ship.position.z - island.position[2];
      const centerDistance = Math.hypot(dx, dz);
      const collisionRadius = island.shoreRadius + shipCollisionRadius;

      // Swept collision prevents the ship from skipping through a shoreline between frames.
      if (
        centerDistance <= collisionRadius ||
        segmentIntersectsIsland(previousPosition, ship.position, island.position[0], island.position[2], collisionRadius)
      ) {
        beginDocking(island);
        return;
      }

      if (centerDistance < closestDistance) {
        closestDistance = centerDistance;
        closestIsland = island;
      }
    }

    if (status && closestIsland && closestDistance <= closestIsland.shoreRadius + 3.1) {
      status.textContent = `Approaching ${closestIsland.title}. Touch the shoreline to open its case study.`;
    }
  }

  function updateShip(delta: number, time: number) {
    if (exploreMode) {
      const keyboardThrottle = Number(keys.has('KeyW') || keys.has('ArrowUp')) - Number(keys.has('KeyS') || keys.has('ArrowDown'));
      const keyboardTurn = Number(keys.has('KeyA') || keys.has('ArrowLeft')) - Number(keys.has('KeyD') || keys.has('ArrowRight'));
      const throttle = THREE.MathUtils.clamp(keyboardThrottle + joystickInput.throttle + dragInput.throttle, -1, 1);
      const turn = THREE.MathUtils.clamp(keyboardTurn - joystickInput.turn + dragInput.turn, -1, 1);
      const targetSpeed = throttle * 4.4;
      currentSpeed = THREE.MathUtils.lerp(currentSpeed, targetSpeed, 1 - Math.exp(-delta * 4.2));
      boatHeading += turn * delta * (1.25 + Math.abs(currentSpeed) * 0.13);
      const previousPosition = ship.position.clone();
      const direction = new THREE.Vector3(Math.sin(boatHeading), 0, Math.cos(boatHeading));
      ship.position.addScaledVector(direction, currentSpeed * delta);
      ship.position.x = THREE.MathUtils.clamp(ship.position.x, -10.5, 10.5);
      ship.position.z = THREE.MathUtils.clamp(ship.position.z, -8.6, 8.6);
      ship.rotation.y = boatHeading;
      checkIslandCollision(previousPosition);
    } else {
      currentSpeed = 0;
      ship.rotation.y = Math.PI + Math.sin(time * 0.22) * 0.13;
      ship.position.x = Math.sin(time * 0.16) * 0.7;
      ship.position.z = 0.25 + Math.cos(time * 0.14) * 0.45;
    }
    ship.position.y = -0.25 + Math.sin(time * 1.8) * 0.045;
    ship.rotation.z = Math.sin(time * 1.45) * 0.025 - currentSpeed * 0.006;
    if (speedReadout) speedReadout.textContent = String(Math.round(Math.abs(currentSpeed) / 4.4 * 100)).padStart(2, '0');
  }

  function updateCamera(delta: number) {
    pointerSmooth.lerp(pointer, 0.045);
    if (exploreMode) {
      const distance = 13.2 + cameraDistanceOffset;
      const height = 8.1 + cameraDistanceOffset * 0.24;
      const behind = new THREE.Vector3(-Math.sin(boatHeading) * distance, height, -Math.cos(boatHeading) * distance);
      desiredCamera.copy(ship.position).add(behind);
      cameraTarget.copy(ship.position).add(new THREE.Vector3(0, 0.75, 0));
    } else {
      const angle = -0.42 + scrollProgress * Math.PI * 0.52;
      const radius = (isMobile ? 29 : 26.5) + cameraDistanceOffset;
      desiredCamera.set(
        Math.sin(angle) * radius + pointerSmooth.x * 0.85,
        (isMobile ? 17.2 : 15.1) + Math.sin(scrollProgress * Math.PI) * 1.15 - pointerSmooth.y * 0.3,
        Math.cos(angle) * radius
      );
      cameraTarget.set(0.75, 0.25, 0);
    }
    camera.position.lerp(desiredCamera, 1 - Math.pow(0.001, delta));
    camera.lookAt(cameraTarget);
  }

  function updateHover() {
    if (dragState?.moved) {
      hoveredSlug = '';
      return;
    }
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(interactiveMeshes, false)[0];
    const slug = (hit?.object.userData.slug as string | undefined) ?? '';
    if (slug !== hoveredSlug) {
      hoveredSlug = slug;
      canvas.style.cursor = slug ? 'pointer' : exploreMode ? 'grab' : 'default';
    }
  }

  function updateLabels() {
    labels.forEach((label) => {
      const slug = label.dataset.projectLabel ?? '';
      const island = islands.get(slug);
      if (!island) return;
      const projected = island.position.clone().add(new THREE.Vector3(0, 2.25, 0)).project(camera);
      const visible = projected.z < 1 && projected.x > -1.18 && projected.x < 1.18 && projected.y > -1.14 && projected.y < 1.14;
      label.style.transform = `translate3d(${(projected.x * 0.5 + 0.5) * shell.clientWidth}px, ${(-projected.y * 0.5 + 0.5) * shell.clientHeight}px, 0) translate(-50%, -50%)`;
      label.classList.toggle('is-visible', visible);
      label.classList.toggle('is-active', slug === hoveredSlug);
    });
  }

  function animate() {
    const currentFrameTime = performance.now();
    const delta = Math.min((currentFrameTime - previousFrameTime) / 1000, 0.05);
    previousFrameTime = currentFrameTime;
    elapsed += delta;
    updateSea(elapsed);
    updateShip(delta, elapsed);
    updateCamera(delta);
    updateHover();

    world.rotation.y = reducedMotion ? 0 : Math.sin(elapsed * 0.08) * 0.012;
    stars.rotation.y += delta * 0.004;
    islands.forEach((island, islandSlug) => {
      const restScale = island.userData.restScale ?? 1;
      const target = islandSlug === hoveredSlug ? restScale * 1.08 : restScale;
      const next = THREE.MathUtils.lerp(island.scale.x, target, 0.08);
      island.scale.setScalar(next);
      const beacon = island.getObjectByName('beacon');
      if (beacon) beacon.rotation.y += delta * 0.7;
    });
    routes.children.forEach((route: THREE.Object3D, index: number) => {
      const line = route as THREE.Line<
        THREE.BufferGeometry,
        THREE.LineDashedMaterial
      >;
      const material = line.material;

      // LineDashedMaterial does not expose dashOffset.
      // Animate the route with a subtle pulse instead.
      material.opacity =
        0.48 + Math.sin(elapsed * 1.7 + index * 0.8) * 0.10;
      material.dashSize =
        0.22 + Math.sin(elapsed * 1.15 + index * 0.55) * 0.025;
      material.needsUpdate = true;
    });
    updateLabels();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

function createIsland(slug: string, color: number, scale: number, variant: number) {
  const group = new THREE.Group();
  group.name = slug;
  group.scale.setScalar(scale);

  const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x26383a, roughness: 0.92, metalness: 0.03, flatShading: true });
  const topMaterial = new THREE.MeshStandardMaterial({ color: 0x54715b, roughness: 0.88, flatShading: true });
  const accentMaterial = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.35, roughness: 0.35 });

  const rock = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 1.34, 1.45, 7, 2), rockMaterial);
  rock.position.y = 0.05;
  rock.castShadow = true;
  rock.receiveShadow = true;
  group.add(rock);

  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.69, 0.76, 0.25, 7), topMaterial);
  top.position.y = 0.88;
  top.castShadow = true;
  group.add(top);

  const beacon = new THREE.Group();
  beacon.name = 'beacon';
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 1.35, 8), new THREE.MeshStandardMaterial({ color: 0xd6cab1, roughness: 0.65 }));
  mast.position.y = 1.55;
  mast.castShadow = true;
  beacon.add(mast);
  const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), accentMaterial);
  crystal.position.y = 2.27;
  crystal.castShadow = true;
  beacon.add(crystal);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.025, 8, 32), accentMaterial);
  ring.position.y = 2.27;
  ring.rotation.x = Math.PI / 2;
  beacon.add(ring);
  group.add(beacon);

  const detailMaterial = new THREE.MeshStandardMaterial({ color: variant % 2 ? 0xc7a06a : 0xa48c67, roughness: 0.8, flatShading: true });
  for (let i = 0; i < 3; i += 1) {
    const detail = new THREE.Mesh(new THREE.ConeGeometry(0.13 + i * 0.025, 0.55 + i * 0.08, 6), detailMaterial);
    const angle = i * 2.1 + variant * 0.7;
    detail.position.set(Math.cos(angle) * 0.48, 1.18 + i * 0.025, Math.sin(angle) * 0.48);
    detail.rotation.z = Math.sin(angle) * 0.12;
    detail.castShadow = true;
    group.add(detail);
  }

  return group;
}

function createRoute(start: THREE.Vector3, end: THREE.Vector3, color: number) {
  const mid = start.clone().lerp(end, 0.5);
  mid.y = 0.08;
  const curve = new THREE.QuadraticBezierCurve3(
    start.clone().setY(-0.34),
    mid,
    end.clone().setY(-0.34)
  );
  const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(42));
  const material = new THREE.LineDashedMaterial({ color, transparent: true, opacity: 0.55, dashSize: 0.22, gapSize: 0.18 });
  const line = new THREE.Line(geometry, material);
  line.computeLineDistances();
  return line;
}

function createCompass() {
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({ color: 0x7ccfc6, transparent: true, opacity: 0.18 });
  [4.2, 8.2, 12.6].forEach((radius) => {
    const ring = new THREE.Mesh(new THREE.RingGeometry(radius - 0.018, radius + 0.018, 96), material);
    ring.rotation.x = -Math.PI / 2;
    group.add(ring);
  });
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x7ccfc6, transparent: true, opacity: 0.12 });
  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2;
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(Math.cos(angle) * 14, 0, Math.sin(angle) * 14)
    ]);
    group.add(new THREE.Line(geometry, lineMaterial));
  }
  return group;
}

function createStars(count: number) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const radius = 20 + Math.random() * 35;
    const angle = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = 4 + Math.random() * 24;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0xd8f4ff, size: 0.085, transparent: true, opacity: 0.72, sizeAttenuation: true });
  return new THREE.Points(geometry, material);
}

function createPandaShip() {
  const ship = new THREE.Group();

  const wood = new THREE.MeshStandardMaterial({ color: 0x6b3f2c, roughness: 0.72, flatShading: true });
  const darkWood = new THREE.MeshStandardMaterial({ color: 0x2f1f1b, roughness: 0.85, flatShading: true });
  const sailMaterial = new THREE.MeshStandardMaterial({ color: 0xead9b9, roughness: 0.9, side: THREE.DoubleSide });
  const black = new THREE.MeshStandardMaterial({ color: 0x101719, roughness: 0.78 });
  const white = new THREE.MeshStandardMaterial({ color: 0xe9eee8, roughness: 0.82 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xe6b85c, roughness: 0.45, metalness: 0.3 });

  const hull = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.82, 2.7, 5), wood);
  hull.rotation.z = Math.PI / 2;
  hull.rotation.y = Math.PI / 2;
  hull.scale.z = 0.56;
  hull.castShadow = true;
  ship.add(hull);

  const deck = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.16, 1.02), darkWood);
  deck.position.y = 0.33;
  deck.castShadow = true;
  ship.add(deck);

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 2.8, 8), darkWood);
  mast.position.set(0.12, 1.45, 0);
  mast.castShadow = true;
  ship.add(mast);

  const sailGeometry = new THREE.BufferGeometry();
  sailGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
    0.18, 2.68, 0,
    0.18, 0.92, 0,
    1.18, 1.22, 0
  ]), 3));
  sailGeometry.setIndex([0, 1, 2]);
  sailGeometry.computeVertexNormals();
  const sail = new THREE.Mesh(sailGeometry, sailMaterial);
  sail.position.z = 0.04;
  sail.castShadow = true;
  ship.add(sail);

  const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 0.28), new THREE.MeshStandardMaterial({ color: 0x49d9c3, side: THREE.DoubleSide, roughness: 0.7 }));
  flag.position.set(0.37, 2.67, 0);
  ship.add(flag);

  const panda = new THREE.Group();
  panda.position.set(-0.35, 0.52, 0);
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.37, 18, 14), white);
  body.scale.set(0.92, 1.08, 0.82);
  body.castShadow = true;
  panda.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 20, 16), white);
  head.position.y = 0.5;
  head.castShadow = true;
  panda.add(head);
  [-1, 1].forEach((side) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 10), black);
    ear.position.set(side * 0.23, 0.77, -0.03);
    ear.castShadow = true;
    panda.add(ear);
    const patch = new THREE.Mesh(new THREE.SphereGeometry(0.105, 14, 10), black);
    patch.scale.set(0.74, 1.18, 0.48);
    patch.position.set(side * 0.13, 0.55, 0.29);
    patch.rotation.z = side * 0.22;
    panda.add(patch);
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 8), white);
    eye.position.set(side * 0.13, 0.56, 0.375);
    panda.add(eye);
  });
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), black);
  nose.scale.set(1, 0.72, 0.58);
  nose.position.set(0, 0.45, 0.34);
  panda.add(nose);
  const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 0.12, 12), black);
  hat.position.set(0, 0.86, 0);
  hat.rotation.z = -0.12;
  panda.add(hat);
  const hatBand = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.025, 6, 18), gold);
  hatBand.position.set(0, 0.81, 0);
  hatBand.rotation.x = Math.PI / 2;
  panda.add(hatBand);
  ship.add(panda);

  const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 8, 18), gold);
  wheel.position.set(-0.05, 0.82, 0.35);
  wheel.rotation.y = Math.PI / 2;
  ship.add(wheel);

  return ship;
}
