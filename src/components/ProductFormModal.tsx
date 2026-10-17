"use client";

import { useForm } from "@tanstack/react-form";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Product, createProduct, productSchema, updateProduct } from "@/lib/server/products";
import { Image, ImageMinus, Plus } from "lucide-react";

const MAX_IMAGE_DIMENSION = 512;

/**
 * Downscale an image file to at most `MAX_IMAGE_DIMENSION` pixels on its
 * longest side and return a JPEG data URL. Runs entirely on the client so
 * oversized uploads are rejected/downscaled before they ever reach the server.
 */
function downscaleImage(file: File, maxDimension = MAX_IMAGE_DIMENSION): Promise<string> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const url = URL.createObjectURL(file);
		img.onload = () => {
			URL.revokeObjectURL(url);
			let width = img.width;
			let height = img.height;
			if (width > maxDimension || height > maxDimension) {
				const scale = Math.min(maxDimension / width, maxDimension / height);
				width = Math.round(width * scale);
				height = Math.round(height * scale);
			}
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				reject(new Error("Unable to process image"));
				return;
			}
			ctx.drawImage(img, 0, 0, width, height);
			resolve(canvas.toDataURL("image/jpeg", 0.85));
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error("Failed to read image file"));
		};
		img.src = url;
	});
}

function isValidImageUrl(value: string): boolean {
	try {
		const url = new URL(value);
		return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "data:";
	} catch {
		return false;
	}
}

interface ProductFormModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** When provided, edits this product. When omitted, creates a new one. */
	product?: Product | null;
	/** Called after a successful create/update. */
	onSuccess?: () => void;
}

export function ProductFormModal({ open, onOpenChange, product }: ProductFormModalProps) {
	const isEdit = !!product;
	const createFn = useServerFn(createProduct);
	const updateFn = useServerFn(updateProduct);

	// Keyed by product id so the form remounts with fresh default values when
	// switching between create and different edit targets.
	const defaultValues = useMemo(
		() => ({
			name: product?.name ?? "",
			description: product?.description ?? "",
			price: product ? String(product.price) : "",
			stock: product ? String(product.stock) : "",
			imageUrl: product?.imageUrl ?? "",
		}),
		[product],
	);

	const [imageFile, setImageFile] = useState<File | null>(null);
	// Data URL preview of a newly picked file (or existing imageUrl in edit mode).
	const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl ?? null);
	const [submitError, setSubmitError] = useState("");

	const form = useForm({
		defaultValues,
		validators: {
			onSubmit: (value) => {
				const result = productSchema.safeParse({
					name: value.name,
					description: value.description,
					price: value.price,
					stock: value.stock,
					imageUrl: value.imageUrl,
				});
				if (!result.success) {
					const errors: Record<string, string> = {};
					for (const issue of result.error.issues) {
						const path = issue.path[0];
						if (path !== undefined) {
							errors[String(path)] = issue.message;
						}
					}
					return errors;
				}
			},
		},
		onSubmit: async ({ value }) => {
			setSubmitError("");
			try {
				let imageUrl: string | undefined = value.imageUrl || undefined;
				if (imageFile) {
					// Client-side downscale happens before the server sees the payload.
					imageUrl = await downscaleImage(imageFile);
				}
				const payload = {
					name: value.name.trim(),
					description: value.description.trim(),
					price: Number(value.price),
					stock: Number(value.stock),
					imageUrl,
				} as { name: string; description: string; price: number; stock: number; imageUrl?: string };

				if (isEdit && product) {
					await updateFn({ data: { id: product.id, ...payload } });
				} else {
					await createFn({ data: payload });
				}
				setImageFile(null);
				setImagePreview(null);
				await onSuccess?.();
				onOpenChange(false);
			} catch (err) {
				setSubmitError(err instanceof Error ? err.message : "Save failed");
			}
		},
	});

	const errorsFor = (name: string) => form.getFieldMeta(name)?.errors ?? [];

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) {
			return;
		}
		if (!file.type.startsWith("image/")) {
			setSubmitError("Please select a valid image file.");
			return;
		}
		setImageFile(file);
		setSubmitError("");
		try {
			const dataUrl = await downscaleImage(file);
			setImagePreview(dataUrl);
			form.setFieldValue("imageUrl", dataUrl);
		} catch (err) {
			setSubmitError(err instanceof Error ? err.message : "Image processing failed");
		}
	};

	const handleRemoveImage = () => {
		setImageFile(null);
		setImagePreview(null);
		form.setFieldValue("imageUrl", "");
	};

	const isSubmitting = form.state.isSubmitting;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{isEdit ? "Edit product" : "Add product"}</DialogTitle>
					<DialogDescription>
						{isEdit
							? "Changes are saved on the server and validated again before being applied."
							: "All fields are required except the image."}
					</DialogDescription>
				</DialogHeader>

				{submitError && (
					<div className="mb-4 p-3 rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
						<span className="opacity-70">!</span>
						{submitError}
					</div>
				)}

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-5"
				>
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							value={form.getFieldValue("name")}
							onChange={(e) => form.setFieldValue("name", e.target.value)}
							placeholder="e.g. Starter Kit"
							className="w-full"
							disabled={isSubmitting}
						/>
						{errorsFor("name").map((message) => (
							<p key={message} className="text-xs text-red-600 dark:text-red-400">
								{message}
							</p>
						))}
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Input
							id="description"
							value={form.getFieldValue("description")}
							onChange={(e) => form.setFieldValue("description", e.target.value)}
							placeholder="e.g. Everything you need to begin."
							className="w-full"
							disabled={isSubmitting}
						/>
						{errorsFor("description").map((message) => (
							<p key={message} className="text-xs text-red-600 dark:text-red-400">
								{message}
							</p>
						))}
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="price">Price</Label>
							<Input
								id="price"
								type="number"
								value={form.getFieldValue("price")}
								onChange={(e) => form.setFieldValue("price", e.target.value)}
								placeholder="0.00"
								className="w-full"
								disabled={isSubmitting}
							/>
							{errorsFor("price").map((message) => (
								<p key={message} className="text-xs text-red-600 dark:text-red-400">
									{message}
								</p>
							))}
						</div>
						<div className="space-y-2">
							<Label htmlFor="stock">Stock</Label>
							<Input
								id="stock"
								type="number"
								value={form.getFieldValue("stock")}
								onChange={(e) => form.setFieldValue("stock", e.target.value)}
								placeholder="0"
								className="w-full"
								disabled={isSubmitting}
							/>
							{errorsFor("stock").map((message) => (
								<p key={message} className="text-xs text-red-600 dark:text-red-400">
									{message}
								</p>
							))}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="image-url">Image (URL or upload)</Label>
						<Input
							id="image-url"
							value={form.getFieldValue("imageUrl")}
							onChange={(e) => form.setFieldValue("imageUrl", e.target.value)}
							placeholder="https://example.com/product.jpg"
							className="w-full"
							disabled={isSubmitting}
						/>
						{errorsFor("imageUrl").map((message) => (
							<p key={message} className="text-xs text-red-600 dark:text-red-400">
								{message}
							</p>
						))}
						<div className="flex items-center gap-3">
							<label
								className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] px-3 py-2 text-sm text-[var(--sea-ink)] cursor-pointer hover:bg-[var(--link-bg-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
								disabled={isSubmitting}
							>
								<Plus className="size-4" />
								Upload image
								<input
									type="file"
									accept="image/*"
									className="sr-only"
									onChange={handleImageChange}
									disabled={isSubmitting}
								/>
							</label>
							{imagePreview && (
								<div className="relative inline-block">
									<img
										src={imagePreview}
										alt="Preview"
										className="w-24 h-24 rounded-xl object-cover border border-[var(--line)]"
									/>
									{!isEdit && (
										<button
											type="button"
											onClick={handleRemoveImage}
											className="absolute -top-2 -right-2 rounded-full border border-[var(--line)] bg-[var(--chip-bg)] p-1 text-xs text-[var(--sea-ink)] hover:bg-[var(--link-bg-hover)]"
											aria-label="Remove image"
										>
											<ImageMinus className="size-3" />
										</button>
									)}
								</div>
							)}
						</div>
						<p className="text-xs text-[var(--sea-ink-soft)]">
							Images are downscaled to a maximum of 512 px before saving.
						</p>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
							{isSubmitting
								? isEdit
									? "Saving..."
									: "Creating..."
								: isEdit
									? "Save changes"
									: "Add product"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
