import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getServerSession } from "@/lib/server/auth";
import { LayoutDashboard, LogOut, Menu, ShoppingCart, Users, X } from "lucide-react";
import { authClient } from "#/lib/auth-client";

/**
 * Pathless layout route for the authenticated admin area.
 *
 * - Guards every descendant route (`/dashboard`, `/products`, `/users`) with a
 *   server-side session check; unauthenticated users are redirected to `/login`.
 * - Renders a collapsible sidebar (desktop) + hamburger drawer (mobile) around
 *   the child route's content via `<Outlet />`.
 */
export const Route = createFileRoute("/_admin")({
	beforeLoad: async () => {
		const { session } = await getServerSession();
		if (!session) {
			return redirect({ to: "/login" }) as any;
		}
	},
	component: AdminLayout,
});

const NAV_ITEMS = [
	{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ to: "/products", label: "Products", icon: ShoppingCart },
	{ to: "/users", label: "Users", icon: Users },
];

function AdminLayout() {
	const [collapsed, setCollapsed] = useState(false);
	const [mobileDrawer, setMobileDrawer] = useState(false);

	return (
		<div className="flex min-h-screen bg-[var(--bg-base)]">
			{/* Desktop sidebar */}
			<aside
				className={
					"fixed inset-y-0 left-0 z-40 w-64 border-r border-[var(--line)] bg-[var(--header-bg)] flex flex-col transition-transform duration-300 lg:static lg:inset-0 lg:translate-x-0"
				}
			>
				<div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--line)]">
					<span className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]" />
					<span
						className={`font-semibold tracking-tight text-[var(--sea-ink)]${collapsed ? " hidden" : " block"}`}
					>
						Ekraf
					</span>
				</div>
				<nav className="flex-1 px-3 space-y-1">
					{NAV_ITEMS.map((item) => {
						const Icon = item.icon;
						return (
							<Link
								key={item.to}
								to={item.to}
								activeProps={{
									className:
										"flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--sea-ink)] bg-[var(--chip-bg)] no-underline",
								}}
								className={
									"flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--sea-ink-soft)] no-underline transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
								}
							>
								<Icon className="size-5" />
								{!collapsed && <span>{item.label}</span>}
							</Link>
						);
					})}
				</nav>
				<div className="px-3 py-4 border-t border-[var(--line)]">
					<Link
						to="/"
						onClick={() => void setCollapsed(false)}
						className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--sea-ink-soft)] no-underline transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
					>
						<LayoutDashboard className="size-5" />
						{!collapsed && <span>View site</span>}
					</Link>
				</div>
			</aside>

			{/* Main content area */}
			<div className="flex-1 min-w-0 relative">
				{/* Mobile hamburger (hidden on desktop) */}
				<div className="lg:hidden px-3 py-2">
					<Button type="button" size="icon" onClick={() => setMobileDrawer(true)} className="ml-1">
						<Menu className="size-5" />
						<span className="sr-only">Open navigation menu</span>
					</Button>
				</div>
				<Outlet />
			</div>

			{/* Mobile drawer */}
			<Dialog open={mobileDrawer} onOpenChange={setMobileDrawer}>
				<DialogContent className="fixed inset-y-0 left-0 z-50 w-full max-w-md p-6 bg-[var(--header-bg)] border-r border-[var(--line)] shadow-2xl">
					<div className="flex items-center justify-between px-2 mb-6">
						<span className="font-semibold tracking-tight text-[var(--sea-ink)]">Ekraf</span>
						<Button
							type="button"
							size="icon"
							onClick={() => setMobileDrawer(false)}
							className="absolute right-2 top-2"
						>
							<X className="size-5" />
							<span className="sr-only">Close menu</span>
						</Button>
					</div>
					<nav className="space-y-2">
						{NAV_ITEMS.map((item) => {
							const Icon = item.icon;
							return (
								<Link
									key={item.to}
									to={item.to}
									onClick={() => void setMobileDrawer(false)}
									activeProps={{
										className:
											"flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--sea-ink)] bg-[var(--chip-bg)] no-underline",
									}}
									className={
										"flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--sea-ink-soft)] no-underline transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
									}
								>
									<Icon className="size-5" />
									<span>{item.label}</span>
								</Link>
							);
						})}
						<Link
							to="/"
							onClick={() => void setMobileDrawer(false)}
							className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--sea-ink-soft)] no-underline transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
						>
							<LayoutDashboard className="size-5" />
							<span>View site</span>
						</Link>
					</nav>
					<div className="mt-auto pt-6 border-t border-[var(--line)]">
						<button
							type="button"
							onClick={() => {
								void authClient.signOut();
								setMobileDrawer(false);
							}}
							className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
						>
							<LogOut className="size-5" />
							Sign out
						</button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
