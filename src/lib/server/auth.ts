import { createServerFn } from "@tanstack/react-start";

import { auth } from "@/lib/auth";
import { SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, db, getUserRole, setUserRole, type Role } from "@/lib/db";
import { getCurrentSession } from "@/lib/session";

/**
 * Server-only session lookup. Safe to call from TanStack Router `beforeLoad`
 * (which runs on the client during client navigation) because server
 * functions always execute on the server.
 */
export const getServerSession = createServerFn({ method: "GET" }).handler(async () => {
	return getCurrentSession();
});

/**
 * One-time development seed: creates the administrator account (password
 * hashed by Better Auth) and seeds sample products. Idempotent.
 *
 * Called from the client via `useServerFn(seedAdmin)` on the /setup page.
 */
export const seedAdmin = createServerFn({ method: "POST" }).handler(async () => {
	if (process.env.NODE_ENV === "production") {
		throw new Error("Pembuatan akun admin awal hanya diizinkan saat pengembangan lokal.");
	}
	const hasAdmin = db.user.some((u) => {
		const role = db.userRole.find((r) => r.userId === u.id)?.role;
		return role === "admin";
	});
	if (hasAdmin) {
		return { ok: true, alreadySeeded: true, admin: SEED_ADMIN_EMAIL };
	}

	await auth.api.signUpEmail({
		body: {
			email: SEED_ADMIN_EMAIL,
			password: SEED_ADMIN_PASSWORD,
			name: "Administrator",
		},
		headers: new Headers(),
	});

	const adminUser = db.user.find((u) => u.email === SEED_ADMIN_EMAIL);
	if (adminUser) {
		const existing = db.userRole.find((r) => r.userId === adminUser.id);
		if (existing) {
			existing.role = "admin";
		} else {
			db.userRole.push({ userId: adminUser.id, role: "admin" });
		}
	}

	return { ok: true, alreadySeeded: false, admin: SEED_ADMIN_EMAIL };
});


/** Return the authenticated user's role; the role is always read server-side. */
export const getMyAccount = createServerFn({ method: "GET" }).handler(async () => {
  const { user } = await getCurrentSession();
  if (!user) return { user: null, role: null };
  return { user, role: getUserRole(user.id) };
});

/** Set the role for the currently authenticated newly registered user only. */
export const setMySignupRole = createServerFn({ method: "POST" })
  .validator((data: { role: "buyer" | "seller" }) => {
    if (!data || !["buyer", "seller"].includes(data.role)) throw new Error("Peran pendaftaran tidak valid.");
    return data;
  })
  .handler(async ({ data }) => {
    const { user } = await getCurrentSession();
    if (!user) throw new Error("Silakan masuk terlebih dahulu.");
    const current = getUserRole(user.id);
    if (current === "admin") throw new Error("Role admin tidak dapat diubah melalui pendaftaran.");
    setUserRole(user.id, data.role as Role);
    return { ok: true, role: data.role };
  });
