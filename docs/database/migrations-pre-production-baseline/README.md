# Archived migration evidence

These four historical migrations are preserved byte-for-byte. They do not reproduce the current Production schema and are outside the active chain.

Active chain: `20261011000000_production_baseline` then `20261011000100_growth_measurement_p0`. The baseline represents the 13 MRT-managed pre-growth tables. It excludes the unmanaged Neon sample table and sequence. Never execute baseline SQL on existing Production; only separately approved baseline resolve is permitted.

- 20260227044909_init: SHA256 `162bd47afec6428c92fdd77b9f12b8cf503bbb542d0616d2f3ad255108d85edd`
- 20260227110349_rfq_final_lock: SHA256 `a77fa806b8c170b1290bc90ff9dc03d15c3571c000111f393263442ae4f74706`
- 20260228163510_rfq_rate_limit: SHA256 `7858534cb701090305730ffb4adf37fc6cfc41ee0337b454b99257497885a6b4`
- 20260301061617_add_lead_link: SHA256 `3e406a47ebab0b52c99708a8e0b5d572d8ffe8cb4019a9a465c13690c75fb34d`
