# ONAN AI build summary

- Rebranded the application as ONAN AI with indigo/electric-blue design tokens, responsive public navigation, premium landing-page composition, and a branded footer.
- Added public `/features`, `/pricing`, and `/about` routes plus a full marketing landing page at `/`.
- Made `/login` the sole sign-in/sign-up route and updated protected-route redirects and setup links; removed the scaffold demo auth route.
- Preserved the TanStack Start + React architecture, TanStack Router file routes, TanStack Query/server functions, Better Auth `memoryAdapter`, and in-memory products/roles.
- Preserved the existing product image URL/preview, client form typing improvements, server-side Zod validation, admin authorization, self-demotion/self-deletion/last-admin protections, login rate limiting, and secure session cookie settings.
- Added `NOTES.md` and reworked `README.md` for ONAN AI setup and routes.

The app intentionally has no persistent database. Product pricing shown on the public marketing pages is illustrative, not live billing. Run `bunx tsr generate`, `bun run lint`, and `bun run build` in a Bun-enabled environment before submission.
