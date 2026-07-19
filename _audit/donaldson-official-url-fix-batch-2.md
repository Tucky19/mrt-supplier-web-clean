# Donaldson Official URL Fix Batch 2

- Date: 2026-07-19
- Repository: `D:\Projects\mrt-supplier-web-clean`
- Branch: `work/fix-donaldson-official-urls-batch-2`
- Scope: `officialUrl` fields only
- Runtime truth: active `products` export from `data/products/index.ts`

## Updated Products

| Part No. | Active source file | Old active URL | New URL |
| --- | --- | --- | --- |
| P102745 | `data/products/products.donaldson.priority.ts` | `https://shop.donaldson.com/store/en-us/product/P102745` | `https://shop.donaldson.com/store/en-th/product/P102745/14594` |
| P105612 | `data/products/products.donaldson.priority.ts` | `https://shop.donaldson.com/store/en-us/product/P105612` | `https://shop.donaldson.com/store/en-th/product/P105612/14705` |
| P112212 | `data/products/products.donaldson.ts` | `https://shop.donaldson.com/store/en-us/product/P112212` | `https://shop.donaldson.com/store/en-th/product/P112212/14841` |
| P119373 | `data/products/products.donaldson.ts` | `https://shop.donaldson.com/store/en-us/product/P119373` | `https://shop.donaldson.com/store/en-th/product/P119373/15053` |
| P119375 | `data/products/products.donaldson.ts` | `https://shop.donaldson.com/store/en-us/product/P119375` | `https://shop.donaldson.com/store/en-th/product/P119375/15055` |
| P123160 | `data/products/products.donaldson.ts` | `https://shop.donaldson.com/store/en-us/product/P123160` | `https://shop.donaldson.com/store/en-th/product/P123160/15172` |
| P124046 | `data/products/products.donaldson.priority.ts` | `https://shop.donaldson.com/store/en-us/product/P124046` | `https://shop.donaldson.com/store/en-th/product/P124046/15194` |
| P127315 | `data/products/products.donaldson.ts` | `https://shop.donaldson.com/store/en-us/product/P127315` | `https://shop.donaldson.com/store/en-th/product/P127315/15260` |
| P131394 | `data/products/products.donaldson.ts` | `https://shop.donaldson.com/store/en-us/product/P131394` | `https://shop.donaldson.com/store/en-th/product/P131394/15383` |
| P134354 | `data/products/products.donaldson.ts` | `https://shop.donaldson.com/store/en-us/product/P134354` | `https://shop.donaldson.com/store/en-th/product/P134354/15439` |

## Duplicate / Dormant Source Handling

- No target was skipped.
- `P102745`, `P119375`, and `P127315` had no extra raw occurrence found in the checked product source files.
- `P105612`, `P112212`, `P119373`, `P123160`, `P131394`, and `P134354` also appear in `data/products/products.batch2.ts`, which is not imported by `data/products/index.ts`; those dormant records were not modified.
- `P119373`, `P123160`, `P124046`, and `P134354` also appear in `data/products/products_filters_mrt_v2.ts`, which is not imported by `data/products/index.ts`; those dormant records were not modified.
- Runtime verification after the patch confirmed all 10 active products resolve to the new URLs listed above.

## Changed Files

- `data/products/products.donaldson.ts`
- `data/products/products.donaldson.priority.ts`
- `_audit/donaldson-official-url-fix-batch-2.md`

## Validation

- `git diff --check`: pass
- `.\node_modules\.bin\tsc.cmd --noEmit`: pass
- `npm run build`: pass after rerun with escalation; first sandboxed run compiled successfully but stopped at local `spawn EPERM`
