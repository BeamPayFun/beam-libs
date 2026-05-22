# @beampay/contracts-abi

## 0.1.1

### Patch Changes

- Sync ABI to BeamRouter v1.4 — `pay()` adds `receiver` param (9 inputs total).

## 0.1.0

### Minor Changes

- Initial public release of @beampay/\* packages.

  Rename scope from `@beam/*` to `@beampay/*` and publish to the public npm registry.
  Adds `publishConfig`, `repository`, `files`, `license`, and `description` fields to
  every package so they are installable via `pnpm add @beampay/<name>` from any consumer
  (beam-demo, beam-api, beam-cron, beam-web, beam-checkout).
