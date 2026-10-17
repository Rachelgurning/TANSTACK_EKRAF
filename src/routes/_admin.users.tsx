import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { authClient } from "#/lib/auth-client";

import { UserRoleModal } from "@/components/UserRoleModal";
import { Button } from "@/components/ui/button";
import type { Role } from "@/lib/db";
import { deleteUser, getUsers } from "@/lib/server/users";
import { cn } from "@/lib/utils";

type UserRow = {
	id: string;
	email: string;
	name: string | null;
	role: Role;
	emailVerified: boolean;
	createdAt: string;
};

export const Route = createFileRoute("/_admin/users")({
	component: Users,
});

function Users() {
	const queryClient = useQueryClient();
	const usersQuery = useQuery({
		queryKey: ["users"],
		queryFn: async () => getUsers(),
	});
	const deleteFn = useServerFn(deleteUser);
	const { data: session } = authClient.useSession();
	const currentUserId = session?.user?.id ?? "";

	const [roleModalOpen, setRoleModalOpen] = useState(false);
	const [roleModalUser, setRoleModalUser] = useState<{
		userId: string;
		userEmail: string;
		role: Role;
	} | null>(null);

	const admins = usersQuery.data?.filter((u) => u.role === "admin").length ?? 0;

	const handleDelete = async (userId: string) => {
		if (!window.confirm("Delete this user?")) {
			return;
		}
		try {
			await deleteFn({ data: { userId } });
			await queryClient.invalidateQueries({ queryKey: ["users"] });
		} catch (err) {
			window.alert(err instanceof Error ? err.message : "Delete failed");
		}
	};

	return (
		<div className="page-wrap px-4 py-12">
			<section className="island-shell rounded-2xl p-6 sm:p-8">
				<div className="flex flex-wrap items-center justify-between gap-4 mb-6">
					<div>
						<p className="island-kicker mb-2">Users</p>
						<h1 className="display-title mb-1 text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
							Users
						</h1>
						<p className="m-0 text-[var(--sea-ink-soft)]">
							Manage user accounts and roles. Administrator only.
						</p>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-sm border-collapse">
						<thead>
							<tr className="bg-[var(--chip-bg)]">
								<th className="px-4 py-3 text-left text-xs font-semibold text-[var(--sea-ink-soft)]">
									Name
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-[var(--sea-ink-soft)]">
									Email
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-[var(--sea-ink-soft)]">
									Role
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-[var(--sea-ink-soft)]">
									Verified
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-[var(--sea-ink-soft)]">
									Joined
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-[var(--sea-ink-soft)]">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{usersQuery.data?.map((user) => {
								const isLastAdmin = user.role === "admin" && admins <= 1;
								const isSelf = user.id === currentUserId;
								return (
									<tr key={user.id} className="border-b border-[var(--line)]">
										<td className="px-4 py-3">
											<p className="text-sm font-medium text-[var(--sea-ink)]">
												{user.name ?? "—"}
											</p>
										</td>
										<td className="px-4 py-3">
											<p className="text-sm text-[var(--sea-ink)] break-all">{user.email}</p>
										</td>
										<td className="px-4 py-3">
											<span
												className={cn(
													"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
													user.role === "admin"
														? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
														: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
												)}
											>
												{user.role}
											</span>
										</td>
										<td className="px-4 py-3">
											<p className="text-sm text-[var(--sea-ink-soft)]">
												{user.emailVerified ? "Yes" : "No"}
											</p>
										</td>
										<td className="px-4 py-3">
											<p className="text-sm text-[var(--sea-ink-soft)]">
												{new Date(user.createdAt).toLocaleDateString()}
											</p>
										</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-2">
												<Button
													type="button"
													size="xs"
													onClick={() => {
														setRoleModalUser({
															userId: user.id,
															userEmail: user.email,
															role: user.role,
														});
														setRoleModalOpen(true);
													}}
													disabled={isSelf}
												>
													Change role
												</Button>
												<button
													type="button"
													onClick={() => void handleDelete(user.id)}
													disabled={isLastAdmin || isSelf}
													className={cn(
														"text-xs underline underline-offset-4 transition-colors",
														isLastAdmin || isSelf
															? "text-[var(--sea-ink-soft)] opacity-50 cursor-not-allowed"
															: "text-red-600 hover:text-red-900",
													)}
												>
													Delete
												</button>
											</div>
										</td>
									</tr>
								);
							})}
							{usersQuery.data?.length === 0 && (
								<tr>
									<td colSpan={6} className="px-4 py-8 text-center text-[var(--sea-ink-soft)]">
										No users yet.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{usersQuery.isError && (
					<p className="mt-4 text-sm text-red-600">
						Failed to load users: {(usersQuery.error as Error).message}
					</p>
				)}

				<UserRoleModal
					open={roleModalOpen}
					onOpenChange={setRoleModalOpen}
					userId={roleModalUser?.userId ?? ""}
					userEmail={roleModalUser?.userEmail ?? ""}
					currentRole={roleModalUser?.role ?? "user"}
					onSuccess={() => {
						void queryClient.invalidateQueries({ queryKey: ["users"] });
					}}
				/>
			</section>
		</div>
	);
}
