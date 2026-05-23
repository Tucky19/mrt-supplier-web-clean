# Product Data Next Audit

Source: `data/products/index.ts`
Generated: 2026-05-23T04:39:51.005Z

## Summary

- Total active products: **206**
- Missing imageUrl/resolved image: **0**
- Missing officialUrl: **1**
- Missing spec/specifications: **0**
- Missing crossReferences/refs: **159**
- Generic-only description/spec: **157**
- Donaldson products needing dimension enrichment: **99**
- Suspicious officialUrl mismatch: **0**

## Audit Rules Used

- Missing resolved image: placeholder fallback or local image path with no file found in `public/`.
- Missing spec/specifications: both `spec` and non-empty `specifications` absent.
- Missing crossReferences/refs: both arrays empty after trimming.
- Generic-only description/spec: default fallback description, generic spec text, or generic-only spec rows with no dimension detail.
- Suspicious officialUrl mismatch: only flagged when normalized URL contains another part-like code but not the current product code.

## Top 20 Priority Products To Fix First

| Part No. | Brand | Priority | Reasons |
| --- | --- | ---: | --- |
| P181056 | donaldson | 130 | missing_official_url, missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment |
| P158669 | donaldson | 87 | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment |
| P162205 | donaldson | 87 | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment |
| P165569 | donaldson | 87 | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment |
| P165705 | donaldson | 87 | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment |
| P170306 | donaldson | 87 | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment |
| P173689 | donaldson | 87 | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment |
| P181035 | donaldson | 87 | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment |
| P181045 | donaldson | 87 | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment |
| P181046 | donaldson | 87 | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment |
| P181052 | donaldson | 87 | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment |
| P181054 | donaldson | 87 | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment |
| P181064 | donaldson | 87 | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment |
| P181080 | donaldson | 87 | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment |
| P181082 | donaldson | 87 | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment |
| P181191 | donaldson | 87 | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment |
| P502009 | donaldson | 87 | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment |
| P502016 | donaldson | 87 | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment |
| P502039 | donaldson | 87 | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment |
| P502072 | donaldson | 87 | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment |

## Recommended Next Batch

Recommended next batch focuses on Donaldson products that currently combine weak cross-reference coverage, default/generic content, and no dimensional enrichment.

- P181056 | donaldson | missing_official_url, missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment
- P158669 | donaldson | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment
- P162205 | donaldson | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment
- P165569 | donaldson | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment
- P165705 | donaldson | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment
- P170306 | donaldson | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment
- P173689 | donaldson | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment
- P181035 | donaldson | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment
- P181045 | donaldson | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment
- P181046 | donaldson | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment
- P181052 | donaldson | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment
- P181054 | donaldson | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment
- P181064 | donaldson | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment
- P181080 | donaldson | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment
- P181082 | donaldson | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment
- P181191 | donaldson | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment
- P502009 | donaldson | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment
- P502016 | donaldson | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment
- P502039 | donaldson | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment
- P502072 | donaldson | missing_refs_and_cross_references, default_description, generic_only_spec_rows, donaldson_needs_dimension_enrichment

## Products Missing ImageUrl/Resolved Image

Count: **0**

None.

## Products Missing OfficialUrl

Count: **1**

| Part No. | Brand | Refs | Cross Refs | Dimensions | Reasons |
| --- | --- | ---: | ---: | --- | --- |
| P181056 | donaldson | 0 | 0 | No | missing_official_url |

## Products Missing Spec/Specifications

Count: **0**

None.

## Products Missing CrossReferences/Refs

Count: **159**

| Part No. | Brand | Refs | Cross Refs | Dimensions | Reasons |
| --- | --- | ---: | ---: | --- | --- |
| P555461 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| X770088 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P828889 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P550084 | Donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P558615 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| C105004 | Donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P565059 | Donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P782105 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P554620 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P554685 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P559000 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P782108 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P551102 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P181059 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P551670 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P550777 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P550615 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P502438 | Donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P181063 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P551311 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P552819 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P551624 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P550848 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P553500 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P551426 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P550318 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P522452 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P822768 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P829333 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P502084 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P556005 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P554403 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P775749 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P552341 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P502163 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P502465 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550035 | Donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P753388 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P558329 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P556916 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550588 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550920 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P551550 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550410 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P554407 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P556915 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550020 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P502072 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550008 | Donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P551551 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P502476 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P551436 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P502039 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P170306 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550132 | Donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P550162 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550222 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550223 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550226 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550227 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550268 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550365 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550367 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550372 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550382 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P550388 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P550391 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550408 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550416 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550428 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550440 | Donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P550445 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550467 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P550478 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550519 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550529 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550576 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P550595 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550596 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550639 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550708 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550719 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550762 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P550769 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P550774 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P558000 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P558616 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P559100 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P559128 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P181034 | Donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P181035 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P181045 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P181046 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P181052 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P164378 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P164384 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P502009 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P502016 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P502083 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P502088 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P502170 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P502190 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P502382 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P502422 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P502458 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P502463 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P502464 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P502502 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P502504 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P502516 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P502594 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P502649 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P505957 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P526428 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P526432 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P526840 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P532473 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P532499 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P532500 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P532501 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P532502 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P536492 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P537405 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P537876 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P537877 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P538259 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P119374 | Donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P158661 | Donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P158669 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P162205 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P165569 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P165705 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P181056 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P181080 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P532966 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P536457 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550900 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P554005 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P822769 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P550958 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P181104 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P181054 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P181064 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P181082 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P181103 | Donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P181191 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| P169478 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P171734 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P171735 | donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P173689 | donaldson | 0 | 0 | No | missing_refs_and_cross_references |
| C 23 115 | MANN-FILTER | 0 | 0 | Yes | missing_refs_and_cross_references |
| P553004 | Donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P551315 | Donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P551329 | Donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P551807 | Donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P158678 | Donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| R800103 | Donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P182034 | Donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |
| P535365 | Donaldson | 0 | 0 | Yes | missing_refs_and_cross_references |

## Products With Generic-Only Description/Spec

Count: **157**

| Part No. | Brand | Refs | Cross Refs | Dimensions | Reasons |
| --- | --- | ---: | ---: | --- | --- |
| P555461 | donaldson | 0 | 0 | Yes | default_description |
| X770088 | donaldson | 0 | 0 | Yes | default_description |
| P828889 | donaldson | 0 | 0 | Yes | default_description |
| P558615 | donaldson | 0 | 0 | Yes | default_description |
| P782105 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P554620 | donaldson | 0 | 0 | Yes | default_description |
| P554685 | donaldson | 0 | 0 | Yes | default_description |
| P559000 | donaldson | 0 | 0 | Yes | default_description |
| P782108 | donaldson | 0 | 0 | Yes | default_description |
| P551102 | donaldson | 0 | 0 | Yes | default_description |
| P181059 | donaldson | 0 | 0 | Yes | default_description |
| P551670 | donaldson | 0 | 0 | Yes | default_description |
| P550777 | donaldson | 0 | 0 | Yes | default_description |
| P550615 | donaldson | 0 | 0 | Yes | default_description |
| P181063 | donaldson | 0 | 0 | Yes | default_description |
| P551311 | donaldson | 0 | 0 | Yes | default_description |
| P552819 | donaldson | 0 | 0 | Yes | default_description |
| P551624 | donaldson | 0 | 0 | Yes | default_description |
| P550848 | donaldson | 0 | 0 | No | default_description |
| P553500 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P551426 | donaldson | 0 | 0 | Yes | default_description, generic_only_spec_rows |
| P550318 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P522452 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P822768 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P829333 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P502084 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P556005 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P554403 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P775749 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P552341 | donaldson | 0 | 0 | Yes | default_description, generic_only_spec_rows |
| P502163 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P502465 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P753388 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P558329 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P556916 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550588 | donaldson | 0 | 0 | No | default_description |
| P550920 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P551550 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550410 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P554407 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P556915 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550020 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P502072 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P551551 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P502476 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P551436 | donaldson | 0 | 0 | Yes | default_description, generic_only_spec_rows |
| P502039 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P170306 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550162 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550222 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550223 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550226 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550227 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550268 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550365 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550367 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550372 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550382 | donaldson | 0 | 0 | Yes | default_description, generic_only_spec_rows |
| P550388 | donaldson | 0 | 0 | Yes | default_description |
| P550391 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550408 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550416 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550428 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550445 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550467 | donaldson | 0 | 0 | Yes | default_description, generic_only_spec_rows |
| P550478 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550519 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550529 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550576 | donaldson | 0 | 0 | Yes | default_description, generic_only_spec_rows |
| P550595 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550596 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550639 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550708 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550719 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550762 | donaldson | 0 | 0 | Yes | default_description, generic_only_spec_rows |
| P550769 | donaldson | 0 | 0 | Yes | default_description, generic_only_spec_rows |
| P550774 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P558000 | donaldson | 0 | 0 | No | default_description |
| P558616 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P559100 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P559128 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P181034 | Donaldson | 0 | 0 | Yes | default_description |
| P181035 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P181045 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P181046 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P181052 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P164378 | donaldson | 0 | 0 | Yes | default_description |
| P164384 | donaldson | 0 | 0 | Yes | default_description |
| P502009 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P502016 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P502083 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P502088 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P502170 | donaldson | 0 | 0 | Yes | default_description, generic_only_spec_rows |
| P502190 | donaldson | 0 | 0 | Yes | default_description, generic_only_spec_rows |
| P502382 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P502422 | donaldson | 0 | 0 | Yes | default_description, generic_only_spec_rows |
| P502458 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P502463 | donaldson | 0 | 0 | Yes | default_description, generic_only_spec_rows |
| P502464 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P502502 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P502504 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P502516 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P502594 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P502649 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P505957 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P526428 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P526432 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P526840 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P532473 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P532499 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P532500 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P532501 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P532502 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P536492 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P537405 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P537876 | donaldson | 0 | 0 | Yes | default_description |
| P537877 | donaldson | 0 | 0 | Yes | default_description |
| P538259 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P119374 | Donaldson | 0 | 0 | Yes | default_description |
| P158661 | Donaldson | 0 | 0 | Yes | default_description |
| P158669 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P162205 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P165569 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P165705 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P181056 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P181080 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P532966 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P536457 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550900 | donaldson | 0 | 0 | No | default_description |
| P554005 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P822769 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P550958 | donaldson | 0 | 0 | Yes | default_description |
| P181104 | donaldson | 0 | 0 | Yes | default_description |
| P554004 | donaldson | 0 | 2 | Yes | default_description |
| P181054 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P181064 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P181082 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P181103 | Donaldson | 0 | 0 | Yes | default_description |
| P181191 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| P169478 | donaldson | 0 | 0 | Yes | default_description, generic_only_spec_rows |
| P171734 | donaldson | 0 | 0 | Yes | default_description, generic_only_spec_rows |
| P171735 | donaldson | 0 | 0 | Yes | default_description, generic_only_spec_rows |
| P173689 | donaldson | 0 | 0 | No | default_description, generic_only_spec_rows |
| C 1112/2 | MANN-FILTER | 1 | 1 | Yes | default_description |
| C 1250 | MANN-FILTER | 1 | 1 | Yes | default_description |
| C 1337 | MANN-FILTER | 3 | 3 | Yes | default_description |
| C 1633/1 | MANN-FILTER | 2 | 2 | Yes | default_description |
| C 23 115 | MANN-FILTER | 0 | 0 | Yes | default_description |
| C 25 710/3 | MANN-FILTER | 1 | 1 | Yes | default_description |
| LB 962/2 | MANN-FILTER | 3 | 3 | Yes | default_description |
| W 719/5 | MANN-FILTER | 2 | 2 | Yes | default_description |
| W 920/21 | MANN-FILTER | 3 | 3 | Yes | default_description |
| W 940/5 | MANN-FILTER | 2 | 2 | Yes | default_description |
| P158678 | Donaldson | 0 | 0 | Yes | default_description |
| R800103 | Donaldson | 0 | 0 | Yes | default_description |
| P182034 | Donaldson | 0 | 0 | Yes | default_description |
| P535365 | Donaldson | 0 | 0 | Yes | default_description |

## Donaldson Products Needing Dimension Enrichment

Count: **99**

| Part No. | Brand | Refs | Cross Refs | Dimensions | Reasons |
| --- | --- | ---: | ---: | --- | --- |
| P782105 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550848 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P553500 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550318 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P522452 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P822768 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P829333 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P502084 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P556005 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P554403 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P775749 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P502163 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P502465 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P753388 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P558329 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P556916 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550588 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550920 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P551550 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550410 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P554407 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P556915 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550020 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P502072 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P551551 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P502476 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P502039 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P170306 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550162 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550222 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550223 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550226 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550227 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550268 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550365 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550367 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550372 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550391 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550408 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550416 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550428 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550445 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550478 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550519 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550529 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550595 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550596 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550639 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550708 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550719 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550774 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P558000 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P558616 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P559100 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P559128 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P181035 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P181045 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P181046 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P181052 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P502009 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P502016 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P502083 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P502088 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P502382 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P502458 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P502464 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P502502 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P502504 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P502516 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P502594 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P502649 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P505957 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P526428 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P526432 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P526840 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P532473 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P532499 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P532500 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P532501 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P532502 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P536492 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P537405 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P538259 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P158669 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P162205 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P165569 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P165705 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P181056 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P181080 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P532966 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P536457 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P550900 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P554005 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P822769 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P181054 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P181064 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P181082 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P181191 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |
| P173689 | donaldson | 0 | 0 | No | donaldson_needs_dimension_enrichment |

## Products With Suspicious OfficialUrl Mismatch

Count: **0**

None.
