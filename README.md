# Engineering portfolio

[Live portfolio](https://ralphjenrey.github.io/kinetic-ui-sample2/) · [GitHub repository](https://github.com/ralphjenrey/kinetic-ui-sample2)

A responsive React JavaScript portfolio using Kinetic UI’s bundled Archivo fonts, theme tokens, typography, hairlines, text-only controls, and accessible interaction patterns. The chosen theme is light/blue with minimal motion.

## Run

```sh
npm install
npm run dev
```

```sh
npm run build
npm run preview
```

## Make it yours

Edit `src/content.js` to set your name, biography, email, social links, and real projects. The initial identity is a placeholder and all three project concepts are explicitly labeled as illustrative. Email and social actions appear when configured. Update the title and description in `index.html` before publishing.

Project filters use a cancellable fade swap; project details use native modal dialogs with Escape, outside-click dismissal, focus containment, and background isolation. Mobile navigation supports Escape and outside-click dismissal. Reduced-motion settings remove transitions and smooth scrolling.

Desktop motion is managed in `src/MotionEffects.jsx`: eased wheel scrolling, bounded scroll-linked parallax on the architectural sketch, project artwork, and headings, plus a blue mouse dot and delayed ring. The ring wraps links and buttons and shows “View” over projects. Effects automatically stop on mobile, coarse pointers, reduced motion, and while a project dialog is open. Preference changes and React teardown clean up listeners and animation frames.

React 19.3.1 and Vite 8.3.8 were verified against npm’s latest dist-tags during setup. The lockfile records the installed dependencies.

Kinetic UI was installed as a Codex skill in `~/.codex/skills/kinetic-ui` and is also a project dependency. The skill will be discovered automatically on your next turn. Font license: `public/fonts/OFL.txt`.

## Deployment

Source lives on `main`. The built static site lives on `gh-pages`, with `.nojekyll`. GitHub repository Settings → Pages uses **Deploy from a branch**, branch **gh-pages**, directory **/ (root)**. Relative asset paths in `vite.config.js` also support other static hosting providers.

To publish an update from an authenticated Git checkout:

```sh
npm run deploy
```

This builds locally, updates the existing `gh-pages` branch without force-pushing, and keeps source and generated assets separate. Custom GitHub Actions builds were unavailable at setup because GitHub reported an account billing lock, so deployment uses the static branch instead.
