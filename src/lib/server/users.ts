import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { db, getUserRole, removeUserRole, setUserRole } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export const userRoleSchema = z.object({
	userId: z.string(),
	role: z.enum(["admin", "user"]),
});

export const getUsers = createServerFn({ method: "GET" }).handler(async () => {
	await requireAdmin();
	return db.user.map((u) => ({
		id: u.id,
		email: u.email,
		name: u.name,
		role: getUserRole(u.id),
		emailVerified: !!u.emailVerified,
		createdAt: u.createdAt.toISOString(),
	}));
});

export const updateUserRole = createServerFn({ method: "POST" })
	.validator(userRoleSchema)
	.handler(async ({ data }) => {
		const { user: actor } = await requireAdmin();
		const target = db.user.find((item) => item.id === data.userId);
		if (!target) {
			const err = new Error("Pengguna tidak ditemukan.") as Error & { status?: number };
			err.status = 404;
			throw err;
		}
		const currentRole = getUserRole(data.userId);
		if (currentRole === "admin" && data.role !== "admin") {
			const adminCount = db.userRole.filter((item) => item.role === "admin").length;
			if (adminCount <= 1) {
				const err = new Error("Peran admin terakhir tidak dapat diturunkan.") as Error & { status?: number };
				err.status = 400;
				throw err;
			}
			if (actor.id === data.userId) {
				const err = new Error("Kamu tidak dapat menurunkan peran admin akun sendiri.") as Error & { status?: number };
				err.status = 400;
				throw err;
			}
		}
		setUserRole(data.userId, data.role);
		return { ok: true };
	});

export const deleteUser = createServerFn({ method: "POST" })
	.validator(z.object({ userId: z.string() }))
	.handler(async ({ data }) => {
		const { user: actor } = await requireAdmin();
		if (actor.id === data.userId) {
			const err = new Error("Kamu tidak dapat menghapus akun sendiri saat sedang masuk.") as Error & { status?: number };
			err.status = 400;
			throw err;
		}
		const target = db.user.find((item) => item.id === data.userId);
		if (!target) {
			const err = new Error("Pengguna tidak ditemukan.") as Error & { status?: number };
			err.status = 404;
			throw err;
		}
		// Prevent removing the last administrator so the app never locks itself out.
		const role = getUserRole(data.userId);
		if (role === "admin") {
			const adminCount = db.userRole.filter((r) => r.role === "admin").length;
			if (adminCount <= 1) {
				const err = new Error("Cannot delete the last administrator") as Error & {
					status?: number;
				};
				err.status = 400;
				throw err;
			}
		}
		db.user = db.user.filter((u) => u.id !== data.userId);
		removeUserRole(data.userId);
		return { ok: true };
	});
