# Donaldson officialUrl Quality Audit

Source used:
- Current active Donaldson products from `data/products/index.ts`

Rules for this audit:
- Used current project data only
- Did not search the internet
- Did not modify product data

## Summary

- Total checked: `192`
- With `officialUrl`: `192`
- Missing `officialUrl`: `0`

## Count By Region / Path

- `shop.donaldson.com /store/en-th/product/`: `51`
- `shop.donaldson.com /store/en-us/product/`: `141`
- Other `shop.donaldson.com` locale paths: `0`
- Non-Donaldson domains: `0`
- Malformed URLs: `0`

## Suspicious URLs

These URLs are structurally present, but may need review because the URL path does not appear to match the product part number.

| Part No. | officialUrl | Reason |
| --- | --- | --- |
| `P551425` | `https://shop.donaldson.com/store/en-th/product/P554685/20902` | URL part number mismatch: path contains `P554685` |

## PartNos That May Need Manual User-Provided Replacement

- `P551425`

## Notes

- This audit checked URL quality structurally only.
- It did not verify whether the target page is live or whether the page content is the correct Donaldson product.
- Based on current active project data, `P551425` is the only clearly suspicious `officialUrl` detected by path-pattern comparison.
