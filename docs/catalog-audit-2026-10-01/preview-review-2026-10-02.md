# Preview review — 2 October 2026 (Asia/Bangkok)

This follow-up supersedes the dimensional coverage counts in the 1 October report; that report remains a dated baseline.

## Browser checks on PR 156, commit 18e1196

- Vercel preview authentication completed by the owner; homepage accessible.
- Homepage search for BFU 900 x returned one exact part, with 85 / 13.3 / 145 mm dimensions.
- Product detail displayed cartridge/replaceable element wording, GTIN 4011558040109, and the same metric dimensions.
- Fuel-filter form submission with OD 85, ID 13.3, height 145 returned BFU 900 x.
- Replacing ID with the erroneous 133.096 returned no result.
- Separator search OD 70, height 200 returned LE5001X and the existing 4900053601 reference record. This is a search check, not a new certification of their interchange or brand identity.
- Desktop dimension-search layout inspected visually. Mobile viewport not tested in this browser.
- Bearing search OD 52, ID 25, width 15 initially returned no result: all 87 active bearing records lacked dimensions. The sample NTN file containing dimensions is not the active catalog; do not count it as production coverage.
- C 14 200 displayed DONALDSON P778984 with a verification disclaimer.
- P537877 correctly hid the invalid rectangular dimensions, but still showed unsupported Activated Carbon media. Removed unverified media fields for both quarantined parts (P537876 Synthetic and P537877 Activated Carbon); no replacement material guessed.

## Data correction after the browser checks

NTN official rendered product tables verified for these exact references (not inferred from other suffixes):

| NTN part | ID mm | OD mm | Width mm | Source |
|---|---:|---:|---:|---|
| 6205C3 | 25 | 52 | 15 | https://eshop.ntn-snr.com/en/product/6205C3-NTN/6205C3 |
| 6205ZZCM/5K | 25 | 52 | 15 | https://eshop.ntn-snr.com/en/product/6205ZZCM_5K-NTN/6205ZZCM-5K |

Added exact-part evidence and runtime dimensions; regenerated search index. Preserved existing stock, price, image, and cross-reference verification state.

Local checks: TypeScript, 800-item index verification and 422-product dimension round trip passed. Added regressions for both bearing references in bearing/all-products categories, and rejection of a 0.1 mm mismatch for bearings.

## Remaining work

- 378 active records still lack searchable dimensions; 85 of these are bearings.
- MANN dimensional evidence covers 86 products; NTN dimensional evidence covers 2 products. Structural checks do not certify all 800 products.
- Full visual image and cross-reference verification remains outstanding.
- P537876/P537877 conflicting dimensions remain quarantined; incomplete manufacturer evidence must not be replaced with guessed dimensions.
- Bearing follow-up deployment 893282a was browser-tested: OD 52 / ID 25 / width 15 returned both verified references. Found and corrected a shared result badge that incorrectly claimed ±3 mm for exact bearing matches; replaced with neutral dimension-criteria wording (form still explains category tolerances).
- Final application commit d4925fefc6f898c7bd8e405161b4e1396fd1ee29 deployed successfully on Vercel. Browser recheck confirmed: English bearing search returns both NTN parts with "Matches dimension criteria"; P537877 no longer displays Activated Carbon. A prior browser check with OD 52.1 / ID 25 / width 15 returned zero results, confirming exact bearing matching. Mobile visual verification remains outstanding.
- No merge to main and no production deployment authorized or performed in this review.
