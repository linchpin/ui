---
title: Development
---

```bash
npm install
npm run build          # babel to build-module/, sass to build-style/
npm test               # jest + @testing-library/react
npm run lint:js
npm run lint:css
npm run storybook      # builds first, then serves
```

- [Brand contract](brand.md)
- [Internationalization](internationalization.md)

## Build

`build:js` compiles `src/` to ESM in `build-module/` with Babel, and `build:style` compiles
`src/style.scss` to `build-style/style.css` with Dart Sass. The package publishes
`build-module/`, `build-style/` and `src/`, so a consumer can take the compiled CSS or the
SCSS source.

## Storybook

Storybook renders the **built** package, aliased to `build-module/index.js`, and the stories
live in `stories/` rather than beside the source. Vite parses JSX only in `.jsx`, WordPress
source is JSX in `.js`, and Storybook's own plugin-react instance wins over any second copy —
so rather than rename every component to suit one tool, the stories import
`@linchpinagency/ui` exactly as a plugin does. What you review is the artifact we publish.
`npm run storybook` and `npm run build-storybook` both build first.

## Tests

Jest with the WordPress preset and Testing Library. `@wordpress/theme` and `uuid` ship ESM
only, so `jest.config.js` names them in `transformIgnorePatterns` and adds an `.mjs`
transform; without that the whole suite fails to load rather than failing a test.

## Release

release-please owns the version, the changelog and the tag. Commit with conventional commits
scoped to the ClickUp key (`feat(LINCHPIN-5639): …`), merge the release PR, and the publish
job runs on the tag.

npm auth is **Trusted Publishing (OIDC)** — no token secret. The first publish of a brand new
package cannot use it, because trusted publishing is configured on a package that already
exists: publish `0.1.0` once from a workstation, then register this repository and
`.github/workflows/release-please.yml` as the trusted publisher on npmjs.com, and every
release after that is tokenless.
