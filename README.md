# JERSEY ON THE GO — Storefront Client

**Slogan:** WEAR IT. OWN IT.  
**Tech Stack:** Next.js 16 + React 19 + TypeScript + Tailwind CSS

---

## Overview

`JOTG-client` is the customer storefront and staff administrative portal for **Jersey On The Go**, the premier football kit & sportswear brand in Bangladesh.

### Key Features
- **Matchday Landing Experience:** Hero banners, category strip, curated bestsellers, and community newsletter.
- **Kit Catalogue:** Filter kits by club, national teams, player/fan editions, and search by team or kit name.
- **Product Customizer:** Interactive size selector (`S` - `XXL`), custom printing (+৳200) with live preview of custom name & jersey number, and sleeve badge selector.
- **Smart Checkout:** Fast guest checkout, district-based shipping calculations (Dhaka vs Nationwide), Cash on Delivery (COD), bKash, and Nagad integration.
- **Order Tracking:** Real-time order lookup by tracking token or Order ID with support for updating/submitting bKash/Nagad transaction IDs.
- **Staff Atelier (Admin Dashboard):** Backoffice order management, 1-Click bKash/Nagad payment verification, fulfillment advancement, and live stock tracking.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront in your browser.

---

## Production Build

```bash
npm run build
npm start
```

---

## Deploy to Vercel

The easiest way to deploy this storefront is using [Vercel](https://vercel.com):

1. Push this repository to GitHub (`https://github.com/hydro1d/JOTG-client.git`).
2. Import the project in Vercel.
3. Framework preset will automatically detect Next.js.
4. Deploy!
