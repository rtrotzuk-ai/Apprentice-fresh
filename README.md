# Apprentice Cafe — fresh-baking alerts

Static front-end for the "Fresh out of the oven" push alerts (customer sign-up page, staff oven board, service worker, icons).
The API and push sender run as the `fresh` Edge Function on Supabase; these files only talk to it.

- `index.html` — customer page (turn alerts on/off, pick favourites, recent batches)
- `staff.html` — oven board (passcode-protected)
- `sw.js` — service worker that shows the notification and opens the ordering page
- `manifest.webmanifest`, icons — lets the page be saved to a phone's Home Screen (required on iPhone)

Generated from `pages.ts` in the Supabase function source; edit there and regenerate rather than editing these by hand.
