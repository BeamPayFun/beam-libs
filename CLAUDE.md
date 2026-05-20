# beam-libs developer notes

## Monorepo layout

- `packages/schemas` — Zod boundary schemas (no runtime deps except zod)
- `packages/common` — error codes, BaseResponse, ApiSignatureUtil, chain metadata (Web Crypto only)
- `packages/contracts-abi` — typed viem ABI + addresses + sync script
- `packages/sdk` — merchant SDK, depends on the other three packages + viem + hono

## Conventions

- Space indent, 100 line width, single quotes, as-needed semicolons (Biome)
- All packages build with `tsup` to `dist/`
- `src/index.ts` is the barrel export
- Tests live next to source (`test/*.test.ts`) and run with Vitest
- Web Crypto (`crypto.subtle`) is used for HMAC so code runs identically in Workers, Node 18+, and browser

## ABI sync

`packages/contracts-abi/scripts/sync-abi.ts` is a stub. A future CI step will:
1. Download the release artifact from `beam-contracts`
2. Overwrite `src/BeamRouter.abi.json`
3. Re-run `tsup` so the `as const` TS file is rebuilt

## Signature protocol (byte-identical across services)

1. Filter out `signature` key
2. Sort keys lexicographically
3. JSON-stringify non-string values
4. Join as `k=v&` pairs
5. HMAC-SHA256(data, secretKey) → hex

See `packages/common/src/signature.ts` for the canonical implementation.
