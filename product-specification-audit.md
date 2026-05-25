# Product Specification Audit

Generated from active runtime products in `data/products/index.ts`, scoped to records detectable from:

- `data/products/products.donaldson.ts`
- `data/products/products.imported.ts`
- `data/products/products.mann.ts`
- `data/products/products.ntn.ts`

No product data, UI, APIs, Prisma schema, RFQ behavior, Missing Product Request behavior, email/LINE behavior, admin code, or GA4 tracking were modified for this audit.

## Summary

- Total active products checked from scoped source files: 194
- Products included in this audit: 118
- Missing structured specifications: 4
- Products with image but missing structured specifications: 4
- Products with some structured rows but likely incomplete/generic: 114

## Priority Rules Used

- High: has product image but no structured specification rows
- Medium: no image and no structured specification rows
- Low: has some structured specification rows, but rows appear generic or incomplete

For this audit, a row was considered detailed when it included concrete dimension/technical labels or values such as outer diameter, inner diameter, length, height, width, thread, efficiency, micron, gasket, bolt, overall length, or mm/inch/micron values. Rows containing only generic fields such as type, style, position, family, or category were treated as incomplete.

## Top 20 High-Priority Products

Only 4 high-priority products were found:

| Part No. | Brand | Category | Source File | Has Image | Has Spec Summary | Has Structured Specs | Spec Count | Priority | Reason |
|---|---|---|---|---|---|---|---:|---|---|
| C 20 500 | MANN-FILTER | air_filter | data/products/products.mann.ts | true | true | false | 0 | High | missing structured specifications |
| CF 500 | MANN-FILTER | air_filter | data/products/products.mann.ts | true | true | false | 0 | High | missing structured specifications |
| C 16 400 | MANN-FILTER | air_filter | data/products/products.mann.ts | true | true | false | 0 | High | missing structured specifications |
| CF 400 | MANN-FILTER | air_filter | data/products/products.mann.ts | true | true | false | 0 | High | missing structured specifications |

## Full Audit Table

| Part No. | Brand | Category | Source File | Has Image | Has Spec Summary | Has Structured Specs | Spec Count | Priority | Reason |
|---|---|---|---|---|---|---|---:|---|---|
| P782105 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 4 | Low | generic spec text and no detailed rows |
| P550848 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 4 | Low | structured rows appear incomplete |
| P553500 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P551426 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P550318 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P522452 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | generic spec text and no detailed rows |
| P822768 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P829333 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P502084 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P556005 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P554403 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P775749 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P552341 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P502163 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P502465 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P753388 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | generic spec text and no detailed rows |
| P558329 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P556916 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P550588 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 4 | Low | structured rows appear incomplete |
| P550920 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P551550 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P550410 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P554407 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P556915 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P550020 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P502072 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P551551 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P502476 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P551436 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P502039 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P170306 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P550065 | Donaldson | filter_kit | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P550162 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P550222 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P550223 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P550226 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P550227 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P550268 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P550365 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P550367 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P550372 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P550382 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P550391 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P550408 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P550416 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P550428 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P550445 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P550467 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P550478 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P550519 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P550529 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P550576 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P550595 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P550596 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P550639 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P550708 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P550719 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P550762 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P550769 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P550774 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P558000 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 4 | Low | structured rows appear incomplete |
| P558616 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P559100 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P559128 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P181035 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P181045 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P181046 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P181052 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P502009 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P502016 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P502083 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P502088 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P502170 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P502190 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P502382 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P502422 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P502458 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P502463 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P502464 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P502502 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P502504 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P502516 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P502594 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P502649 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P505957 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P526428 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P526432 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | generic spec text and no detailed rows |
| P526840 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P532473 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P532499 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P532500 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P532501 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P532502 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P536492 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P537405 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P538259 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P158669 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | generic spec text and no detailed rows |
| P162205 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P165569 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P165705 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P181080 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P532966 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P536457 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P550900 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 4 | Low | structured rows appear incomplete |
| P554005 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| P822769 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P181054 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P181064 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P181082 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P181191 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | generic spec text and no detailed rows |
| P169478 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P171734 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P171735 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 2 | Low | structured rows appear incomplete |
| P173689 | donaldson | filter | data/products/products.donaldson.ts | true | true | true | 3 | Low | structured rows appear incomplete |
| C 20 500 | MANN-FILTER | air_filter | data/products/products.mann.ts | true | true | false | 0 | High | missing structured specifications |
| CF 500 | MANN-FILTER | air_filter | data/products/products.mann.ts | true | true | false | 0 | High | missing structured specifications |
| C 16 400 | MANN-FILTER | air_filter | data/products/products.mann.ts | true | true | false | 0 | High | missing structured specifications |
| CF 400 | MANN-FILTER | air_filter | data/products/products.mann.ts | true | true | false | 0 | High | missing structured specifications |

