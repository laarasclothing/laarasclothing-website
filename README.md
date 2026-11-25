# laarasclothing.in — Laara's Clothing by aRu

Static website for Laara's Studio, Bhiwani. Hosted on **Cloudflare Workers (static assets)**, connected to this repo; every push to `main` goes live in about a minute. Config: `wrangler.jsonc` (serves `site/`).

## Folders
- `site/` — the published website (Cloudflare Pages build output directory). No build step.
  - `index.html` home (English / Hindi) · `shop.html` styles, prices, cart and WhatsApp order · `contact`, `terms`, `privacy`, `refund`, `shipping` policy pages · `style.css` · `favicon.svg`
- `apps-script/Code.gs` — Google Apps Script that receives each website order, adds it to a Google Sheet and emails admin@laarasclothing.in. Not published on the site.

## Cloudflare Pages settings
- Framework preset: None · Build command: (empty) · Build output directory: `site` · Production branch: `main`

## Order flow
Customer ticks styles on `shop.html` → Place order → order saved to the Google Sheet (via `ORDER_ENDPOINT` in `shop.html`) and emailed to admin → thank-you screen with reference `LS-DDMM-XXXX` → WhatsApp opens with the order to +91 62800 80140.

## Prices
From the project doc `Laara_Catalogue_Price_List.md` (drafts until the Bhiwani tailor survey). Edit the `CATS` list in `site/shop.html`.
