import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, redirect, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { authClient } from "#/lib/auth-client";

import { UserRoleModal } from "@/components/UserRoleModal";
import { Button } from "@/components/ui/button";
import type { Role } from "@/lib/db";
import { getServerSession } from "@/lib/server/auth";
import { deleteUser, getUsers } from "@/lib/server/users";

export const Route = createFileRoute("/admin/users/$userId")({
	beforeLoad: async () => {
		const { session } = await getServerSession();
		if (!session) {
			return redirect({ to: "/login" }) as any;
		}
	},
	component: UserDetail,
});

function UserDetail() {
	const { userId } = useParams({
		from: "/users/$userId",
	});
	const queryClient = useQueryClient();
	const deleteFn = useServerFn(deleteUser);
	const { data: session } = authClient.useSession();
	const isSelf = session?.user?.id === userId;

	const usersQuery = useQuery({
		queryKey: ["users"],
		queryFn: async () => getUsers(),
	});
	const user = usersQuery.data?.find((u) => u.id === userId);

	if (usersQuery.isPending) {
		return (
			<div className="page-wrap px-4 py-12">
				<p className="text-[var(--sea-ink-soft)]">Loading user...</p>
			</div>
		);
	}
	if (!user) {
		return (
			<div className="page-wrap px-4 py-12">
				<p className="text-[var(--sea-ink-soft)]">User not found.</p>
			</div>
		);
	}

	const [roleModalOpen, setRoleModalOpen] = useState(false);
	const [message, setMessage] = useState("");

	const handleDelete = async () => {
		if (!window.confirm("Delete this user?")) {
			return;
		}
		try {
			await deleteFn({ data: { userId } });
			await queryClient.invalidateQueries({ queryKey: ["users"] });
			window.location.href = "/users";
		} catch (err) {
			setMessage(err instanceof Error ? err.message : "Delete failed");
		}
	};

	const admins = usersQuery.data?.filter((u) => u.role === "admin").length ?? 0;
	const isLastAdmin = user.role === "admin" && admins <= 1;

	return (
		<div className="page-wrap px-4 py-12">
			<section className="island-shell rounded-2xl p-6 sm:p-8">
				<div className="flex items-center gap-3 mb-6">
					<Link
						to="/users"
						className="text-xs text-[var(--sea-ink-soft)] underline underline-offset-4 hover:text-[var(--sea-ink)]"
					>
						&larr; Back to users
					</Link>
					<h1 className="display-title text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
						User Details
					</h1>
				</div>

				{message && <p className="mb-5 text-sm text-[var(--sea-ink)]">{message}</p>}

				<div className="grid gap-4 sm:grid-cols-3">
					<div className="rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] p-5">
						<p className="m-0 text-sm text-[var(--sea-ink-soft)]">Name</p>
						<p className="m-0 mt-1 text-base font-medium text-[var(--sea-ink)]">
							{user.name ?? "—"}
						</p>
					</div>
					<div className="rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] p-5">
						<p className="m-0 text-sm text-[var(--sea-ink-soft)]">Email</p>
						<p className="m-0 mt-1 text-base font-medium text-[var(--sea-ink)] break-all">
							{user.email}
						</p>
					</div>
					<div className="rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] p-5">
						<p className="m-0 text-sm text-[var(--sea-ink-soft)]">Role</p>
						<span className="mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
							{user.role}
						</span>
					</div>
				</div>

				<div className="mt-8 flex gap-3">
					<Button
						type="button"
						onClick={() => {
							setRoleModalOpen(true);
						}}
						disabled={isSelf}
					>
						Change role
					</Button>
					<button
						type="button"
						onClick={handleDelete}
						disabled={isLastAdmin || isSelf}
						className={`bg-red-50 border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 rounded-xl hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-800/30 transition-colors disabled:opacity-50 ${
							isLastAdmin || isSelf ? "cursor-not-allowed" : ""
						}`}
					>
						Delete User
					</button>
				</div>

				<UserRoleModal
					open={roleModalOpen}
					onOpenChange={setRoleModalOpen}
					userId={user.id}
					userEmail={user.email}
					currentRole={user.role}
					onSuccess={() => {
						void queryClient.invalidateQueries({ queryKey: ["users"] });
					}}
				/>
			</section>
		</div>
	);
}
