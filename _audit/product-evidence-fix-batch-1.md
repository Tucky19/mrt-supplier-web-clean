# Product Evidence Fix Batch 1

Date: 2026-06-30  
Branch: `work/product-evidence-audit`  
Baseline HEAD: `77fcceb29d2f94991b358ac3a015f049575f35db`

## Scope

This batch changes only the approved product-evidence records, two official product images extracted from supplied Donaldson PDFs, and this audit note. It does not change search-index files or run import, enrich, or migration scripts.

## Evidence and changes by part number

### P502913

- Source: `incoming/donaldson_specs_batch_01.pdf.zip` -> `p502913.pdf`.
- Visually verified the rendered Donaldson specification page identifies `P502913` and shows the matching spin-on fuel/water separator.
- Extracted the PDF's embedded 700 x 700 PNG without recomposition.
- Added `public/images/products/donaldson/p502913.png`.
- Updated `imageUrl` from the runtime placeholder to `/images/products/donaldson/p502913.png`.
- SHA-256: `5B6E167EDCB3D16724FD20F3360318F66F2D0973C453518125A0CDE7B6205744`.

### P502522

- Source: `incoming/donaldson_specs_batch_01.pdf.zip` -> `p502522.pdf`.
- Visually verified the rendered Donaldson specification page identifies `P502522` and shows the matching cartridge fuel/water separator.
- Extracted the PDF's embedded 700 x 700 PNG without recomposition.
- Added `public/images/products/donaldson/p502522.png`.
- Updated `imageUrl` from the runtime placeholder to `/images/products/donaldson/p502522.png`.
- SHA-256: `F870F91E3D212D0697052828AEB578A72B69E0830F43E235D669B1880647A948`.

### P532503 / P532504

- Removed `P532503` from P532504's generic `crossReferences`.
- Added reciprocal `pairedParts`: P532503 identifies P532504 as the inner/safety part, and P532504 identifies P532503 as the outer/primary part.
- No other references or product fields changed.

### P777868 / P777869

- Removed `P777868` from P777869's generic `crossReferences`.
- Added reciprocal `pairedParts`: P777868 identifies P777869 as the inner/safety part, and P777869 identifies P777868 as the outer/primary part.
- Existing unrelated application/interchange references were preserved.

### P551006 / P552006

- Removed P552006 from P551006's generic `refs` because the verified relationship is supersession, not interchange.
- The current schema has no dedicated replacement/supersession field. The verified statement that P552006 replaces P551006 is preserved in P551006's `sourceNote` rather than forced into a lossy relation field.
- P552006 required no data change.
- P551006 remains `needs_review`; the coarse whole-record flag was not promoted based only on the supersession decision.

### P550903 / Fleetguard FS19781

- Replaced the generic Donaldson search URL with `https://shop.donaldson.com/store/en-th/product/P550903`.
- Preserved `Fleetguard FS19781` in `crossReferences`.
- Added a provenance note for the official Donaldson product page and Fleetguard search evidence.
- Set `sourceType` to `mixed` because the retained relation is supported by a second manufacturer's evidence.
- Kept whole-record `dataQuality: "needs_review"` to avoid overclaiming fields outside this evidence batch.

### LF14000NN / Donaldson P559000

- Replaced the generic Fleetguard homepage with `https://www.fleetguard.com/product/lf14000nn/01t5x000008FDTrAAO`.
- Preserved `Donaldson P559000` in `crossReferences`.
- Updated the existing provenance note to name the official product page and Fleetguard search evidence.
- Existing replacement/upgrade notes remain outside generic relation arrays because the schema cannot represent those relation types safely.

## Runtime aggregate verification

The final active export from `data/products/index.ts` was loaded after the patch. It confirmed:

- both new product image paths are active;
- the P532503/P532504 and P777868/P777869 relationships are reciprocal `pairedParts`, not mutual interchange;
- P551006 no longer exposes P552006 as a generic reference;
- P550903 retains FS19781 and uses the exact Donaldson URL;
- LF14000NN retains P559000 and uses the exact Fleetguard URL.

## Validation

- `git diff --check`: PASS
- `.\node_modules\.bin\tsc.cmd --noEmit`: PASS
- `npm run build`: PASS after removing stale generated `.next` artifacts and rerunning outside the sandbox. Next.js compiled successfully, completed TypeScript checks, and generated all 1,828 static pages.

Temporary PDF-render files under `tmp/pdfs/` were removed after inspection.

## Files intentionally changed

- `data/products/products.donaldson.priority.ts`
- `data/products/products.fleetguard.ts`
- `data/products/products.uploaded.ts`
- `public/images/products/donaldson/p502913.png`
- `public/images/products/donaldson/p502522.png`
- `_audit/product-evidence-fix-batch-1.md`

No search-index file was modified.
