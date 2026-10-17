import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Sparkles } from "lucide-react";
export const Route = createFileRoute("/pricing")({ component: Pricing });
const plans = [
	{
		name: "Starter",
		price: "Free preview",
		description: "For individuals exploring AI in everyday work.",
		items: [
			"Core AI tools",
			"Personal workspace",
			"Basic usage quota",
			"Community-ready workflows",
		],
		featured: false,
	},
	{
		name: "Pro",
		price: "Flexible",
		description: "For people and teams ready to do more with AI.",
		items: [
			"Expanded tool access",
			"Document intelligence",
			"Advanced workflows",
			"API capability preview",
		],
		featured: true,
	},
	{
		name: "Enterprise",
		price: "Let's talk",
		description: "For organizations with tailored needs and governance.",
		items: [
			"Configurable access",
			"Team-oriented workflows",
			"Integration planning",
			"Dedicated rollout discussion",
		],
		featured: false,
	},
];
function Pricing() {
	return (
		<main className="page-wrap px-4 py-14 sm:py-20">
			<div className="mx-auto max-w-3xl text-center">
				<div className="island-kicker">Plans & access</div>
				<h1 className="display-title mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">
					The right tools for <span className="gradient-text">your next step.</span>
				</h1>
				<p className="mt-5 text-lg leading-8 text-[var(--sea-ink-soft)]">
					Choose a starting point, explore the platform, and grow into more capable workflows when
					you’re ready.
				</p>
			</div>
			<div className="mt-12 grid gap-4 lg:grid-cols-3">
				{plans.map((plan) => (
					<article
						key={plan.name}
						className={`price-card ${plan.featured ? "price-card-featured" : ""}`}
					>
						{plan.featured && <span className="popular-tag">Most flexible</span>}
						<p className="mt-3 text-sm font-bold text-[var(--sea-ink-soft)]">{plan.name}</p>
						<h2 className="mt-2 text-3xl font-extrabold">{plan.price}</h2>
						<p className="mt-3 min-h-14 text-sm leading-7 text-[var(--sea-ink-soft)]">
							{plan.description}
						</p>
						<ul className="mt-6 grid gap-3 text-sm">
							{plan.items.map((item) => (
								<li key={item}>
									<Check size={16} />
									{item}
								</li>
							))}
						</ul>
						<Link
							to="/login"
							className={`${plan.featured ? "primary-cta" : "secondary-cta"} mt-8 w-full`}
						>
							{plan.name === "Enterprise" ? "Contact us" : "Get started"} <ArrowRight size={16} />
						</Link>
					</article>
				))}
			</div>
			<p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-6 text-[var(--sea-ink-soft)]">
				This assignment build uses in-memory product data and is a demonstration of the product
				experience. Plan prices, quotas, and billing are not live payment offers.
			</p>
			<div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
				<div className="flex items-start gap-3">
					<Sparkles className="mt-1 text-blue-600" />
					<div>
						<h3 className="font-extrabold">Need a tailored setup?</h3>
						<p className="mt-1 text-sm leading-6 text-[var(--sea-ink-soft)]">
							Sign in to explore the workspace, or use the admin dashboard to manage the available
							tools and product information.
						</p>
						<Link
							to="/login"
							className="mt-3 inline-flex items-center gap-2 text-sm font-bold no-underline"
						>
							Open ONAN AI <ArrowRight size={15} />
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}
