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
npm run verify:esm     # the built package loads under native Node ESM
```

- [Brand contract](brand.md)
- [Internationalization](internationalization.md)
- [Releasing and publishing](releasing.md)

## Build

`build:js` compiles `src/` to ESM in `build-module/` with Babel, and `build:style` compiles
`src/style.scss` to `build-style/style.css` with Dart Sass. The package publishes
`build-module/`, `build-style/` and `src/`, so a consumer can take the compiled CSS or the
SCSS source.

### Relative imports get an extension at build time

Source is written the WordPress way, without file extensions:

```js
export { default as LinchpinAdminFrame } from './components/admin-frame';
```

A bundler resolves that. Node's own ESM resolver does not, and since the package declares
`"type": "module"` and points `exports` at `build-module/`, it would present as ESM Node can
load and not be — which is exactly what `0.2.0` shipped as.

`scripts/babel-plugin-add-js-extension.cjs` rewrites relative specifiers during `build:js`,
so the source stays idiomatic and the artifact is loadable. It resolves against the
filesystem rather than appending `.js` blindly, so a directory import becomes `/index.js` and
an unresolvable specifier is left alone and stays a visible error. It is scoped to the
`module` Babel env; Jest resolves extensionless imports on its own.

It is local rather than a dependency on purpose. The two published plugins that do this were
last released in 2021 and 2022.

`npm run verify:esm` checks the built output — it scans for extensionless specifiers in
either quote style, then actually imports `build-module/index.js` under native ESM. CI runs
it after the build. Both halves matter: the plugin is unit tested, but a Babel env that
stopped applying it would leave every unit test passing, and Babel prints single quotes for
a node it passed through untouched versus double quotes for one it rewrote — so a scan
written against double quotes alone passes in precisely the case it exists to catch.

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

npm auth is **Trusted Publishing (OIDC)** — no token secret, and npm attaches provenance by
itself, which is why `publishConfig` does not ask for it. Asking for it would break the one
publish that cannot run in CI: the first.

### The one-time first publish

Trusted publishing is configured *on a package*, so a package that does not exist yet cannot
have a trusted publisher. Once, from a workstation:

```bash
git checkout main && git pull
npm whoami                 # must be a member of @linchpinagency
npm ci
npm publish --access public    # add --otp=<code> if your npm account has 2FA on writes
```

`prepack` cleans and rebuilds, so the tarball is never a stale `build-module/`. Check what it
will contain first with `npm pack --dry-run`.

Then on npmjs.com, under the package's **Settings → Trusted publisher**, add:

| Field | Value |
| --- | --- |
| Provider | GitHub Actions |
| Organization or user | `linchpin` |
| Repository | `ui` |
| Workflow filename | `release-please.yml` |
| Environment | *(leave empty — the publish job does not use one)* |

After that, merging a release PR publishes on its own and no one needs npm credentials
again.
