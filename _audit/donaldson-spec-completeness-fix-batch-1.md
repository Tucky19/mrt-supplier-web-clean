# Donaldson spec completeness fix batch 1

Date: 2026-07-11

Scope: Seven active Donaldson products only: P502477, P537893, P550523, P554105, P827653, P829332, R000958.

Source folder: `C:\Users\lkjhg\Desktop\DATA_do_14-5-26 - 1\DATA_do_14-5-26`

## Source gate

All seven exact Donaldson PDF files were present, readable, and contained matching `Product Specifications` part identities:

| Part | PDF | Matching identity confirmed |
| --- | --- | --- |
| P502477 | `p502477.pdf` | Yes |
| P537893 | `p537893.pdf` | Yes |
| P550523 | `p550523.pdf` | Yes |
| P554105 | `p554105.pdf` | Yes |
| P827653 | `p827653.pdf` | Yes |
| P829332 | `p829332.pdf` | Yes |
| R000958 | `r000958.pdf` | Yes |

## Files changed

- `data/products/products.donaldson.priority.ts`
- `_audit/donaldson-spec-completeness-fix-batch-1.md`

## Product changes

Only `spec` and `specifications` fields were enriched. Titles, categories, `officialUrl`, refs, crossReferences, stock status, images, and source metadata were preserved.

### P502477

- Added: Outer Diameter `124 mm (4.88 inch)`, Inner Diameter `44 mm (1.73 inch)`, Length `271 mm (10.67 inch)`, Media Type `Cellulose`, Collapse Burst `6.9 bar (100 psi)`.
- Preserved existing PDF-backed values: Style `Cartridge`, Primary Application `PERKINS 996452`, UPC Code `742330963708`.

### P537893

- Added: Overall Length `394 mm (15.51 inch)`, Outer Diameter `187 mm (7.36 inch)`, Inner Diameter `121 mm (4.76 inch)`, Length `381 mm (15.00 inch)`, Bolt Hole Diameter `17 mm (0.67 inch)`, Efficiency `99.9`, Efficiency Test Std `ISO 5011`, Media Type `Cellulose`.
- Preserved existing PDF-backed values: Type `Primary`, Style `Round`, UPC Code `742330203118`.

### P550523

- Added: Outer Diameter `128.8 mm (5.07 inch)`, Inner Diameter `85.1 mm (3.35 inch)`, Length `174.8 mm (6.88 inch)`, Efficiency Beta 2 `9 micron`, Efficiency Beta 1000 `26 micron`, Collapse Burst `6.9 bar (100 psi)`, Media Type `Cellulose`.
- Preserved existing PDF-backed values: Style `Cartridge`, Primary Application `CATERPILLAR 4T0522`, UPC Code `742330042601`.

### P554105

- Added: Outer Diameter `118 mm (4.65 inch)`, Thread Size `1 1/2-16 UN`, Length `298 mm (11.73 inch)`, Gasket OD `110 mm (4.33 inch)`, Gasket ID `98 mm (3.86 inch)`, Efficiency `99% 40 micron`, Efficiency Test Std `SAE J1858`, Media Type `Cellulose`, Collapse Burst `10.3 bar (149 psi)`.
- Preserved existing PDF-backed values: Type `Full-Flow`, Style `Spin-On`, Primary Application `CATERPILLAR 2P4005`, UPC Code `742330044629`.

### P827653

- Added: Outer Diameter `138.2 mm (5.44 inch)`, Inner Diameter `81.3 mm (3.20 inch)`, Length `321.8 mm (12.67 inch)`, Efficiency `99.9`, Efficiency Test Std `ISO 5011`, Family `FPG`, Brand `RadialSeal™`, Media Type `Cellulose`.
- Preserved existing PDF-backed values: Type `Primary`, Style `RadialSeal`, UPC Code `742330049051`.

### P829332

- Added: Outer Diameter `84.4 mm (3.32 inch)`, Inner Diameter `64.8 mm (2.55 inch)`, Length `314.4 mm (12.38 inch)`, Efficiency `95`, Efficiency Test Std `ISO 5011`, Family `FPG`, Brand `RadialSeal™`.
- Preserved existing PDF-backed values: Type `Safety`, Style `RadialSeal`, UPC Code `742330049075`.

### R000958

- Added: Outer Diameter `291 mm (11.46 inch)`, Inner Diameter `168 mm (6.61 inch)`, Length `432 mm (17.01 inch)`, Efficiency `99.9`, Efficiency Test Std `ISO 5011`, Brand `RadialSeal™`, Media Type `Cellulose`.
- Preserved existing PDF-backed values: Type `Primary`, Style `RadialSeal`, UPC Code `742330989296`.

## Validation

- `git diff --check`: PASS
- `.\node_modules\.bin\tsc.cmd --noEmit`: PASS
- `npm run build`: PASS after retry with elevated filesystem permission. First sandboxed run failed with Windows `EPERM` unlinking `.next\app-path-routes-manifest.json`; the retry completed successfully.
