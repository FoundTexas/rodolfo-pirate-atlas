# Rodolfo León — The Builder's Atlas

Astro portfolio draft combining a readable professional site with an optional Three.js pirate archipelago.

## Stack

- Astro
- Bootstrap
- Three.js
- TypeScript
- Static output for Vercel

## Run locally

```bash
npm install
npm run dev
```

Production check:

```bash
npm run build
npm run preview
```

## Structure

The portfolio is intentionally compact:

1. SAS Viya consulting work
2. Cloud-native backend work at GBM
3. Web applications and client sites
4. FoundTexas playable projects
5. Mobile game performance work

The web work is grouped into one case study instead of presenting every website as a separate top-level project.

## Public website links

- Twinly: `https://twinly-petwear.vercel.app/`
- ADI: `https://adi.foundtexas.net/`
- Cacao Finca 17: `https://cacao-finca-17.vercel.app/`
- Óptimo Ópticas: `https://optimoopticas.mx/`
- Masoftcode: `https://masoftcode.com/`
- FoundTexas: `https://foundtexas.itch.io/`

Website cards use live generated previews from Thum.io and fall back to the panda SVG when a preview cannot load.

## Visual identity

`public/profile-panda-transparent.svg` is the primary avatar and brand mark across the header, hero, interactive section, About section, contact area and footer. The PNG version is no longer required.

## Vercel

The project uses Astro's default static output. Import the repository into Vercel, keep the Astro framework preset, and deploy after `npm install` and `npm run build` succeed.


## Seventh draft interaction

- Mobile virtual joystick for the panda ship.
- Sailing into a project island opens its case study.
- Conceptual SAS and cloud diagrams are shown where public screenshots are not appropriate.
- The panda SVG is displayed on transparent surfaces.

### Island docking behavior

The ship uses swept circle collision against each island shoreline, so it cannot skip through an island between animation frames. Touching a shoreline stops the ship, shows the island name, and opens the matching case study. Island labels remain direct links for visitors who prefer standard navigation.

## Refreshing the local dev server

This draft changes both the joystick runtime and the panda asset path. Stop older Astro instances and restart with:

```bash
npx astro dev stop || true
npm run dev -- --host --force
```

On mobile, enter **Explore the sea** to reveal the joystick. This build removes any legacy arrow-button controls at runtime.
