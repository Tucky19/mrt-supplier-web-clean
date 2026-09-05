# Air Filter Primary / Safety Pairing Audit

Audit date: 2026-09-05

## Objective

Identify Primary and Safety air filters that are explicitly shown as related by an official manufacturer source. No pair was inferred from dimensions, appearance, adjacent part numbers, or cross-reference data.

## Sources and acceptance rule

- Donaldson official product pages: `Related Parts`
- Donaldson official Engine Air Filter Catalogue: `Main Element / Safety Element` tables
- A relationship was accepted only when the official source named one part as a Primary air filter and the other as a Safety air filter.
- Related hardware, alternate Primary filters, filter kits, and parts not present in the active MRT catalog were excluded.

Official catalogue: https://ecatalog.donaldson.com/view/477292580

## Result summary

| Item                                                        | Count |
| ----------------------------------------------------------- | ----: |
| Active air-filter products reviewed                         |   144 |
| Donaldson air-filter products                               |   138 |
| MANN-FILTER air-filter products                             |     6 |
| Donaldson product pages with a usable direct product record |    67 |
| Newly verified Primary/Safety relationships added           |    22 |
| Products with at least one paired part after this update    |    57 |
| Unique paired relationships after this update               |    32 |
| Products without a displayed pair                           |    87 |

The 87 products without a displayed pair are not automatically defects. This group includes DuraLite assemblies, panel filters, breathers, single-stage filters, and records for which the official source did not provide enough pairing evidence.

## Newly added verified relationships

| Primary Filter | Safety Filter | Official evidence                                                                 |
| -------------- | ------------- | --------------------------------------------------------------------------------- |
| P181059        | P112212       | [Donaldson P181059](https://shop.donaldson.com/store/en-us/product/P181059/17821) |
| P181046        | P119373       | [Donaldson P119373](https://shop.donaldson.com/store/en-us/product/P119373/15053) |
| P181034        | P119374       | [Donaldson P181034](https://shop.donaldson.com/store/en-us/product/P181034/17797) |
| P182034        | P119374       | [Donaldson P182034](https://shop.donaldson.com/store/en-us/product/P182034/17937) |
| P535365        | P119374       | [Donaldson P535365](https://shop.donaldson.com/store/en-us/product/P535365/19668) |
| R800103        | P119374       | [Donaldson R800103](https://shop.donaldson.com/store/en-us/product/R800103/22654) |
| P181064        | P119375       | [Donaldson P181064](https://shop.donaldson.com/store/en-us/product/P181064/17826) |
| P181052        | P123160       | [Donaldson P123160](https://shop.donaldson.com/store/en-us/product/P123160/15172) |
| P181080        | P127315       | [Donaldson P127315](https://shop.donaldson.com/store/en-us/product/P127315/15260) |
| P181042        | P128408       | [Donaldson P181042](https://shop.donaldson.com/store/en-us/product/P181042/17805) |
| P181054        | P131394       | [Donaldson P181054](https://shop.donaldson.com/store/en-us/product/P181054/17816) |
| P181103        | P158661       | [Donaldson P181103](https://shop.donaldson.com/store/en-us/product/P181103/17859) |
| P181103        | P158678       | [Donaldson P181103](https://shop.donaldson.com/store/en-us/product/P181103/17859) |
| P181104        | P158669       | [Donaldson P158669](https://shop.donaldson.com/store/en-us/product/P158669/15743) |
| P181118        | P158670       | [Donaldson P158670](https://shop.donaldson.com/store/en-us/product/P158670/15744) |
| P181119        | P158671       | [Donaldson P158671](https://shop.donaldson.com/store/en-us/product/P158671/15745) |
| P181191        | P522452       | [Donaldson P181191](https://shop.donaldson.com/store/en-us/product/P181191/17906) |
| P781039        | P777639       | [Donaldson P777639](https://shop.donaldson.com/store/en-us/product/P777639/21940) |
| P777871        | P777875       | [Donaldson P777871](https://shop.donaldson.com/store/en-us/product/P777871/21960) |
| P778972        | P780012       | [Donaldson P778972](https://shop.donaldson.com/store/en-us/product/P778972/22046) |
| P778984        | P780024       | [Donaldson P778984](https://shop.donaldson.com/store/en-us/product/P778984/22048) |
| P778994        | P780036       | [Donaldson P778994](https://shop.donaldson.com/store/en-us/product/P778994/22050) |

## Multiple-pair cases confirmed

- Safety `P119374` is officially related to multiple Primary filters in the active catalog: `P181034`, `P182034`, `P535365`, and `R800103`.
- Primary `P181103` is officially related to two Safety filters in the active catalog: `P158661` and `P158678`.
- The existing verified relationship for Safety `P116446` remains linked to Primary `P181049` and `P182049`.

## Excluded from automatic publication

- A related item was outside the active MRT catalog.
- The Donaldson page described an `AIR FILTER KIT`; a kit was not reclassified as Primary or Safety.
- The relation was only a cross reference or alternate, not a Main/Safety pairing.
- The source page did not identify the role clearly enough.
- Similar dimensions or appearance were the only available clues.

## Implementation safeguards

- Pair records are applied bidirectionally: Primary displays Safety, and Safety displays all verified Primary filters.
- Existing manually verified pairs are preserved and deduplicated.
- A validation script checks that both products exist, both are air filters, and both directions are present.
- Unverified relationships remain hidden from the paired-filter UI.
