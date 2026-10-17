# Revamp summary

- Replaced scaffold-style global navigation with responsive Ekraf branding and icon navigation; removed About and demo authentication route files.
- Made `/login` the primary authentication page and added stable selectors for automated login tests.
- Fixed product field updates by forcing the form component to refresh after TanStack Form field updates.
- Added optional image URL input and preview, persists image URL on create/edit, and displays thumbnails in the product list.
- Added bounded server-side Zod validation for product fields and image URL/data URL size/protocol.
- Added admin-only route guard for user management and server-side protections against self-demotion, self-deletion, and last-admin removal.
- Enabled Better Auth login rate limiting and explicit session cookie attributes.
- Added `NOTES.md` with the failure analysis and security rationale.

Data is still intentionally in memory. No database was added.
