# Missing Donaldson Product Images

The catalog is already wired to load Donaldson images from:

`public/images/products/donaldson/{partNo-lowercase}.jpg`

These part numbers are still falling back to the placeholder because the image files do not exist yet:

- `P532503` -> `public/images/products/donaldson/p532503.jpg`
- `P532504` -> `public/images/products/donaldson/p532504.jpg`
- `P550520` -> `public/images/products/donaldson/p550520.jpg`
- `P551329` -> `public/images/products/donaldson/p551329.jpg`
- `P551425` -> `public/images/products/donaldson/p551425.jpg`
- `P551807` -> `public/images/products/donaldson/p551807.jpg`

After adding each file, the corresponding product page should show the real image automatically without further code changes.
