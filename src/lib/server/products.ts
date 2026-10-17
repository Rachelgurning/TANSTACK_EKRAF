import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { type Product, db, getUserRole } from "@/lib/db";
import { requireAuth } from "@/lib/session";

export const productSchema = z.object({
	name: z.string().trim().min(3, "Nama produk minimal 3 karakter.").max(120),
	description: z.string().trim().min(10, "Deskripsi minimal 10 karakter.").max(1000),
	price: z.coerce.number().finite().positive("Harga harus lebih dari nol."),
	stock: z.coerce.number().int().min(0, "Stok tidak boleh negatif.").max(100000),
});

export type ProductInput = z.infer<typeof productSchema>;

// TanStack Start server functions support GET and POST only. Mutations use
// POST and encode the intended action in the validator/body.
export const getProducts = createServerFn({ method: "GET" }).handler(async () => {
	return [...db.product].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) as Product[];
});

export const createProduct = createServerFn({ method: "POST" })
	.validator(productSchema)
	.handler(async ({ data }) => {
		const { user } = await requireAuth();
		const now = new Date().toISOString();
		const product = {
			id: crypto.randomUUID(),
			sellerId: user.id,
			...data,
			createdAt: now,
			updatedAt: now,
		} as Product;
		db.product.push(product);
		return product;
	});

export const updateProduct = createServerFn({ method: "POST" })
	.validator(
		z.object({
			id: z.string(),
			...productSchema.shape,
		}),
	)
	.handler(async ({ data }) => {
		const { user } = await requireAuth();
		const index = db.product.findIndex((p) => p.id === data.id);
		if (index === -1) {
			const err = new Error("Produk tidak ditemukan.") as Error & { status?: number };
			err.status = 404;
			throw err;
		}
		const existingProduct = db.product[index];
		if (existingProduct.sellerId ? existingProduct.sellerId !== user.id && getUserRole(user.id) !== "admin" : getUserRole(user.id) !== "admin") {
			const err = new Error("Kamu hanya bisa mengubah produk milikmu.") as Error & { status?: number };
			err.status = 403;
			throw err;
		}
		const now = new Date().toISOString();
		const updated = {
			...db.product[index],
			name: data.name,
			description: data.description,
			price: data.price,
			stock: data.stock,
			updatedAt: now,
		} as Product;
		db.product[index] = updated;
		return updated;
	});

export const deleteProduct = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.string() }))
	.handler(async ({ data }) => {
		const { user } = await requireAuth();
		const index = db.product.findIndex((p) => p.id === data.id);
		if (index === -1) {
			const err = new Error("Produk tidak ditemukan.") as Error & { status?: number };
			err.status = 404;
			throw err;
		}
		const existingProduct = db.product[index];
		if (existingProduct.sellerId ? existingProduct.sellerId !== user.id && getUserRole(user.id) !== "admin" : getUserRole(user.id) !== "admin") {
			const err = new Error("Kamu hanya bisa menghapus produk milikmu.") as Error & { status?: number };
			err.status = 403;
			throw err;
		}
		db.product.splice(index, 1);
		return { ok: true };
	});
