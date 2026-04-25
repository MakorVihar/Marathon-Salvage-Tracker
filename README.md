# Marathon Salvage Tracker

A local React app for tracking salvage items, planning faction upgrades, and scanning
inventory screenshots using NCC template matching + Tesseract OCR.

## Setup

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Build for production

```bash
npm run build
npm run preview
```

## Screenshot scanning

Click **⬆ IMPORT** in the salvage list panel and select a screenshot of your
in-game inventory. The app will:

1. Run multi-scale NCC template matching against the 40 item icons to locate
   each item on screen.
2. Use Tesseract.js OCR to read the quantity number from each matched slot.
3. Show you a review dialog so you can correct any misreads before applying.

Works best with full-resolution screenshots at native game resolution.

## Project structure

```
src/
  App.tsx               — main component (data + UI)
  icons.ts              — maps item names → imported PNG assets
  assets/salvage/       — 40 item PNG icons
  main.tsx              — React entry point
  vite-env.d.ts         — PNG module declaration for TypeScript
index.html
vite.config.ts
package.json
```
