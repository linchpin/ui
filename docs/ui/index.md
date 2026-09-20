---
title: Linchpin UI
---

`@linchpinagency/ui` is Linchpin's admin component library for WordPress plugins: the branded
chrome every one of our plugins puts around its own screen, in one package instead of one copy
per repository.

It is a thin layer **on top of** core. Components come from `@wordpress/components`,
`@wordpress/ui` and `@wordpress/admin-ui`; what lives here is the arrangement, the brand
contract and the agency copy. It is not a design system and does not re-implement buttons,
cards, form controls or tables — and the page header, with its breadcrumbs, subtitle, badges
and section navigation, is core's `Page`, wrapped rather than rebuilt.

## Where to start

- [Installation](getting-started/installation.md) — install, peer dependencies, the stylesheet.
- [Components](components/index.md) — what the package exports and what each part owns.
- [Brand contract](development/brand.md) — how a plugin colours itself.
- [Development](development/index.md) — build, test, release.

Storybook, published from `main`, shows the components rendered. These pages say what we have
decided about them. Neither restates the other.

## The two rules

**No hex in a component.** Colour comes from a `--wpds-*` design token or from the
`--lp-brand-*` custom properties the frame sets out of `defineBrand()`.

**The About Linchpin copy is fixed.** `<AboutLinchpinPage>` and `<AboutLinchpinCard>` take no
copy props, so a revision reaches every plugin through a version bump rather than one pull
request per repository.
