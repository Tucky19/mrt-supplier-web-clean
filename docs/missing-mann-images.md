# MANN Image Path Checklist

The current product data uses the brand value `MANN-FILTER`.

With the current image resolver, MANN product images should live under:

`public/images/products/mann-filter/{partNo-lowercase}.jpg`

Example paths from the current catalog:

- `W11102/36` -> `public/images/products/mann-filter/w11102/36.jpg`
- `W13145/3` -> `public/images/products/mann-filter/w13145/3.jpg`
- `W920/21` -> `public/images/products/mann-filter/w920/21.jpg`
- `W940/5` -> `public/images/products/mann-filter/w940/5.jpg`
- `W950` -> `public/images/products/mann-filter/w950.jpg`
- `W962/14` -> `public/images/products/mann-filter/w962/14.jpg`

Important note:

- Because many MANN part numbers contain `/`, the current naming convention is not filesystem-safe.
- Before uploading a MANN image batch, the path strategy should be normalized first, for example by replacing `/` with `-` or `_`.
- Do not upload a large MANN batch yet until that filename rule is decided.
