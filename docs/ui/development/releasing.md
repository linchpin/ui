---
title: Releasing and publishing
---

Two machines own this pipeline and neither asks permission: **release-please** decides the
version and writes `CHANGELOG.md` from the commit history, and the **Release** workflow
publishes the resulting tag to npm. Nothing here is a version number you type.

## The normal path

1. Merge a PR to `main` with conventional commits. `feat` bumps the minor while the package
   is pre-1.0, `fix` and `improve` bump the patch.
2. release-please opens or updates a rolling release PR.
3. Merging **that** PR tags the version and cuts a GitHub release, which flips
   `release_created` to `true` on the following run.
4. `publish-npm` checks out the tag, runs the tests, and publishes.

Authentication is [npm Trusted Publishing][tp]: the `id-token: write` permission lets npm
mint a short-lived credential from GitHub's OIDC token, so there is no `NPM_TOKEN` to rotate
or leak, and provenance is attached automatically.

[tp]: https://docs.npmjs.com/trusted-publishers

## The first publish is different, and this catches everyone

**Trusted publishing cannot create a package that does not exist.** The trusted-publisher
record lives in a package's own settings on npm, so there is nowhere to put it until the
package is on the registry. `npm trust` states the requirement outright: *"The package
you're configuring must already exist on the npm registry."*

A first release therefore fails at the last step, after a green build, with what looks like
a permissions problem and is not one:

```
npm error code E404
npm error 404 Not Found - PUT https://registry.npmjs.org/@linchpinagency%2fui - Not found
```

That is what happened to `v0.2.0`, and to `@linchpinagency/cli` v1.1.1 before it. The
workflow now checks the registry *before* building and fails with the remedy instead.

### Bootstrapping, once

Either route works; the first needs nobody at a terminal.

**From CI.** Add an `NPM_TOKEN` secret to the repository — a granular token with write
access to the `@linchpinagency` scope — then run the Release workflow manually with
`tag` set to the stranded tag and `bootstrap` ticked. Provenance still applies, because
`id-token: write` is what signs the attestation regardless of how npm authenticated.

**From a workstation**, by someone with publish rights on the scope:

```bash
git checkout v0.2.0
npm ci && npm run build
npm publish
```

Whatever is published this way **carries no provenance**, because provenance is signed with
a CI runner's OIDC token and there is none on a workstation. That is the cost of the route,
and it applies to exactly one version.

If `publishConfig.provenance` is ever set back to `true`, this publish will be refused rather
than silently skipping the attestation, and needs `npm publish --no-provenance`. It is
currently unset for this reason — see `3364bce`.

### Then register the trusted publisher

```bash
npm trust github @linchpinagency/ui \
  --repo linchpin/ui \
  --file release-please.yml \
  --allow-publish
```

Or the same fields on npmjs.com under the package's settings. Two things to get right:

- The workflow filename is `release-please.yml` and must match exactly — all fields are
  case-sensitive, and npm does not validate the configuration when you save it. A typo
  surfaces only as a failed publish.
- Leave the **environment** field empty. `publish-npm` declares no `environment:`, and a
  configured one that the job does not enter will never match.

Finally, delete the `NPM_TOKEN` secret if you added one. It exists to cover the first
publish and nothing else.

## Republishing a stranded tag

A publish can fail for reasons that have nothing to do with the code — the registry is down,
the package did not exist yet. The tag and the GitHub release still exist, and re-running
the job does not help: it re-runs release-please, which now finds nothing to release.

Run the Release workflow manually with `tag` set to the version to publish, and leave
`bootstrap` unticked:

```bash
gh workflow run release-please.yml -f tag=v0.2.0
```

This publishes an existing tag over OIDC. It does not create a version, move a tag, or
touch the changelog.

## What you must never hand-edit

`CHANGELOG.md`, `.release-please-manifest.json`, and the version strings in `package.json`
and `README.md` — `README.md` is listed under `extra-files` in `release-please-config.json`,
so it is machine-owned too. Editing any of them puts the repo into a state its next release
PR fights with. Never create a tag or a GitHub release by hand either; the publish fires off
them.
