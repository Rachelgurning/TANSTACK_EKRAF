"use client";

import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { authClient } from "#/lib/auth-client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Role } from "@/lib/db";
import { updateUserRole } from "@/lib/server/users";
import { ShieldAlert, User } from "lucide-react";

interface UserRoleModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	userId: string;
	userEmail: string;
	currentRole: Role;
	onSuccess?: () => void;
}

export function UserRoleModal({
	open,
	onOpenChange,
	userId,
	userEmail,
	currentRole,
	onSuccess,
}: UserRoleModalProps) {
	const updateRoleFn = useServerFn(updateUserRole);
	const { data: session } = authClient.useSession();
	const isSelf = session?.user?.id === userId;

	const [role, setRole] = useState<Role>(currentRole);
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		if (isSelf && role !== "admin") {
			setError("You cannot demote your own administrator role.");
			return;
		}
		setSubmitting(true);
		try {
			await updateRoleFn({ data: { userId, role } });
			onSuccess?.();
			onOpenChange(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Role update failed");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Change role</DialogTitle>
					<DialogDescription>
						Set the access role for <span className="font-semibold break-all">{userEmail}</span>.
					</DialogDescription>
				</DialogHeader>

				{error && (
					<div className="mb-4 p-3 rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30 text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
						<ShieldAlert className="size-4 opacity-70" />
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="role">Role</Label>
						<Select
							id="role"
							value={role}
							onValueChange={(value) => setRole(value as Role)}
							disabled={submitting}
						>
							<SelectTrigger className="w-[200px]">
								<SelectValue placeholder="Select a role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="user">User</SelectItem>
								<SelectItem value="admin">Administrator</SelectItem>
							</SelectContent>
						</Select>
						{isSelf && role === "admin" && (
							<p className="text-xs text-[var(--sea-ink-soft)]">
								Demoting your own account is not allowed.
							</p>
						)}
						{!isSelf && role !== currentRole && (
							<p className="text-xs text-[var(--sea-ink-soft)]">
								Server will re-check authorization before applying.
							</p>
						)}
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={submitting}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={submitting}>
							{submitting ? "Updating..." : "Update role"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
