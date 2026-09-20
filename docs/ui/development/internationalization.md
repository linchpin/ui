---
title: Internationalization
---

Strings in this package use `__()` with **no text domain**, which puts them in the default
domain.

## Why

A text domain belongs to the plugin that loads the translations. This package is bundled into
a dozen different plugins, each with its own domain and its own `.pot`. Hardcoding
`linchpin-ui` would ask every consumer to register and ship translations for a domain they do
not own, and `wp-scripts` would extract our strings into their `.pot` under a domain their
`load_plugin_textdomain()` call never loads — so the strings would be extracted, translated,
and then ignored at runtime.

The default domain is the honest option: nothing pretends to be translatable through a
mechanism that would not work.

`@wordpress/eslint-plugin`'s `i18n-text-domain` rule is turned off in `eslint.config.js` for
exactly this reason, and nothing else.

## What this costs

Chrome strings — "Need a hand?", "Work with Linchpin", the About copy, the accessible labels
— render in English unless the site translates the default domain.

## If we need real translation

The options, in the order we would try them:

1. **Build-time domain substitution.** A Babel plugin rewrites `__( 'x' )` to
   `__( 'x', 'consumer-domain' )` as the consuming plugin builds, so the strings land in the
   consumer's `.pot`. This is the approach worth taking if a client needs a localized admin.
2. **A prop-based override** for the handful of user-facing strings, leaving the fixed About
   copy alone.

Neither is built. Raise it when a project actually needs it rather than on principle.
