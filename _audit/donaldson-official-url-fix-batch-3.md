# Donaldson Official URL Fix Batch 3

- Date: 2026-07-22
- Repository: `D:\Projects\mrt-supplier-web-clean`
- Branch: `work/fix-donaldson-official-urls-batch-3`
- Scope: `officialUrl` fields only
- Runtime truth: active `products` export from `data/products/index.ts`

## Updated Products

| Part No. | Active source file | Old active URL | New URL |
| --- | --- | --- | --- |
| P142810 | `data/products/products.donaldson.ts` | `https://shop.donaldson.com/store/en-us/product/P142810` | `https://shop.donaldson.com/store/en-th/product/P142810/15595` |
| P145756 | `data/products/products.donaldson.ts` | `https://shop.donaldson.com/store/en-us/product/P145756` | `https://shop.donaldson.com/store/en-th/product/P145756/15622` |
| P150135 | `data/products/products.donaldson.priority.ts` | `https://shop.donaldson.com/store/en-us/product/P150135` | `https://shop.donaldson.com/store/en-th/product/P150135/15676` |
| P158669 | `data/products/products.donaldson.ts` | `https://shop.donaldson.com/store/en-us/product/P158669` | `https://shop.donaldson.com/store/en-th/product/P158669/15743` |
| P158670 | `data/products/products.donaldson.ts` | `https://shop.donaldson.com/store/en-us/product/P158670` | `https://shop.donaldson.com/store/en-th/product/P158670/15744` |
| P158671 | `data/products/products.donaldson.priority.ts` | `https://shop.donaldson.com/store/en-us/product/P158671` | `https://shop.donaldson.com/store/en-th/product/P158671/15745` |
| P162205 | `data/products/products.donaldson.ts` | `https://shop.donaldson.com/store/en-us/product/P162205` | `https://shop.donaldson.com/store/en-th/product/P162205/15903` |
| P164168 | `data/products/products.donaldson.priority.ts` | `https://shop.donaldson.com/store/en-us/product/P164168` | `https://shop.donaldson.com/store/en-th/product/P164168/16004` |
| P164178 | `data/products/products.donaldson.priority.ts` | `https://shop.donaldson.com/store/en-us/product/P164178` | `https://shop.donaldson.com/store/en-th/product/P164178/16009` |
| P164703 | `data/products/products.donaldson.priority.ts` | `https://shop.donaldson.com/store/en-us/product/P164703` | `https://shop.donaldson.com/store/en-th/product/P164703/16089` |

## Duplicate / Dormant Source Handling

- No target was skipped.
- `P145756` and `P158671` had no extra raw occurrence found in the checked product source files.
- `P142810`, `P150135`, and `P158669` also appear in `data/products/products.batch2.ts`, which is not imported by `data/products/index.ts`; those dormant records were not modified.
- `P162205`, `P164168`, `P164178`, and `P164703` also appear in `data/products/products.batch3.ts`, which is not imported by `data/products/index.ts`; those dormant records were not modified.
- `P158669` and `P158670` also appear in `data/products/products_filters_mrt_v2.ts`, which is not imported by `data/products/index.ts`; those dormant records were not modified.
- Runtime verification after the patch confirmed all 10 active products resolve to the new URLs listed above.

## Changed Files

- `data/products/products.donaldson.ts`
- `data/products/products.donaldson.priority.ts`
- `_audit/donaldson-official-url-fix-batch-3.md`

## Validation

- `git diff --check`: pass
- `.\node_modules\.bin\tsc.cmd --noEmit`: pass
- `npm run build`: pass after rerun with escalation; first sandboxed run compiled successfully but stopped at local `spawn EPERM`
