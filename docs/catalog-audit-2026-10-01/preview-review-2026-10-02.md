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

## Remaining work after the initial two NTN references

- 378 active records still lack searchable dimensions; 85 of these are bearings.
- MANN dimensional evidence covers 86 products; NTN dimensional evidence covers 2 products. Structural checks do not certify all 800 products.
- Full visual image and cross-reference verification remains outstanding.
- P537876/P537877 conflicting dimensions remain quarantined; incomplete manufacturer evidence must not be replaced with guessed dimensions.
- Bearing follow-up deployment 893282a was browser-tested: OD 52 / ID 25 / width 15 returned both verified references. Found and corrected a shared result badge that incorrectly claimed ±3 mm for exact bearing matches; replaced with neutral dimension-criteria wording (form still explains category tolerances).
- Final application commit d4925fefc6f898c7bd8e405161b4e1396fd1ee29 deployed successfully on Vercel. Browser recheck confirmed: English bearing search returns both NTN parts with "Matches dimension criteria"; P537877 no longer displays Activated Carbon. A prior browser check with OD 52.1 / ID 25 / width 15 returned zero results, confirming exact bearing matching. Mobile visual verification remains outstanding.
- No merge to main and no production deployment authorized or performed in this review.

## NTN batch 2 — 16 additional exact references

Added manufacturer-sourced millimetre dimensions for 7312BL1G, 7313BL1G, 7309BL1G, 7307BL1G, 6307LLU, 6210C3, 6206LLU, 6207LLB, 6210ZZ, 33213U, 6016CM, 6205CM, 6206ZZ, 6310ZZ, 6205ZC3 and 7304BL1G. Per-part official URLs and verification scope are recorded in `data/products/ntn-metric-2026-10-02.json`. No suffix or SNR-brand substitution was used.

For tapered 33213U, searchable width is assembled T=41 mm; inner ring B=41 mm and outer ring C=32 mm are retained as separate fields. A regression rejects C=32 as the assembled width.

Latest coverage supersedes earlier counts: 438/800 records have searchable dimensions or thread data; 362 remain without it, including 69 bearings. NTN exact dimensional evidence now covers 18 references; MANN evidence remains 86. This is not full certification of images, cross-references, or every specification.

Checks: 800-item search index, 438-product dimension round trip, all 16 new exact-dimension fixtures in bearing/all-product categories and rejection of 0.1 mm width mismatches passed. TypeScript and production build passed. Preview publication and browser verification are tracked below.

Application commit `612800ba9ffd5ee23d42f3a60d2b8442b73f4cab` deployed successfully to Vercel preview. Live browser tests returned 7312BL1G for ID 60 / OD 130 / width 31 mm and 33213U for ID 65 / OD 120 / width 41 mm. Changing the latter width to 32 mm returned zero results. No merge or production deployment performed.

## Owner decision — 4550092941 excluded (2 October, 04:00 Bangkok)

Boss requested removal of 4550092941 from this work batch. The exact part is absent from the active catalog and search index; no replacement or new listing is to be created from the supplied 4550092941.jpg. Do not use that image for the distinct existing 4570092941 record. The existing 4570092941 remains request-only, with no newly asserted stock. TB1394/1X stock and screenshot cross-reference changes remain prepared locally and unpublished.

## Ordinary-length policy — prepared, not published (2 October)

Owner requested ordinary Length instead of Overall Length for every affected product. Search now prioritizes explicit Length irrespective of row order and legacy length overrides; Overall Length remains a separately labelled reference specification, never a fallback search length. 36 runtime records switch to their existing Length value; five overall-only records lose length search (R011866, P550478, P164178, P812924, P506115) while retaining other dimensions/part-number search. 438 catalog dimensional round trips, policy regressions, TypeScript and production build passed. Manual search-function smoke checks returned P145756 at 492.25 mm (not 501.9) and P550851 at 171.6 mm (not 178.6). This verifies field selection, not fresh manufacturer certification of all source values. P777868 has existing Length 524 versus Overall Length 517.8; source consistency still needs review.

C085004 remains excluded from further dimension mapping changes at owner's request. TB1394/1X remains on hold. No branch publication, merge or deployment in this batch; hold for consolidated update.

## Revised owner policy — Length / Overall Length (2 October, 04:26 Bangkok)

Supersedes the ordinary-only search policy above. The dimension form now reads Length / Overall Length (mm). Search accepts either explicitly recorded value; sorting uses the smaller distance to either value, while normal Length remains the canonical value and the two source labels remain distinct. Overall-only products can again be searched using their recorded Overall Length. No new measurements inferred. C085004 mapping and held TB1394 changes remain untouched; no publication/deployment. P550851 search-function checks find the part at both 171.6 and 178.6 mm. Tests exercise every recorded searchable length, exact alternatives, distance ranking and quarantined products.

Owner confirmed P777868 Length=524 mm on 2 October at 04:33 Bangkok. Prepared correction removes conflicting Overall Length=517.8 mm from runtime specifications and searchable alternatives. Supersedes the pending length-conflict note above. Held for consolidated publication.

Owner general rule (2 October, 04:34): when Overall Length is shorter than ordinary Length, prefer ordinary Length and exclude the contradictory overall value from dimension search. Valid ordinary/overall pairs remain searchable by either value. No values are swapped or guessed. Prepared locally, not published.

## FULL / BLACK CLUB owner policy — 2 October 05:16 Bangkok

All FULL (11) and BLACK CLUB (17) products use brand images and the exact Thai inquiry label สอบถาม (English Inquire), including product cards and detail pages. No dimensional data is to be published for these two brands. Explicitly excluded from dimensional search and the missing-dimensions backlog: these 28 records are intentional exclusions, not incomplete dimension work. Part-number search/RFQ remain available. Reuses existing brand assets full-filter.webp and the BC emblem backcup.webp. Held locally for consolidated publication.
