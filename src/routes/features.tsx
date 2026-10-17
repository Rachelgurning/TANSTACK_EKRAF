import { Link, createFileRoute } from "@tanstack/react-router";
import {
	ArrowRight,
	Bot,
	Braces,
	BrainCircuit,
	FileSearch,
	ShieldCheck,
	Sparkles,
	Workflow,
} from "lucide-react";
export const Route = createFileRoute("/features")({ component: Features });
const items = [
	{
		icon: Bot,
		title: "AI chat & ideation",
		tag: "THINK",
		description:
			"Explore ideas, draft content, explain unfamiliar concepts, and work through problems with a conversational AI experience.",
	},
	{
		icon: FileSearch,
		title: "Document analysis",
		tag: "UNDERSTAND",
		description:
			"Bring long documents into focus with summaries, key points, and answers grounded in the information you provide.",
	},
	{
		icon: Workflow,
		title: "Workflow automation",
		tag: "AUTOMATE",
		description:
			"Identify repetitive steps and design more consistent ways to get everyday work done.",
	},
	{
		icon: Braces,
		title: "Developer API",
		tag: "BUILD",
		description:
			"Plan how AI capabilities can connect to your existing tools and customer experiences.",
	},
	{
		icon: BrainCircuit,
		title: "Knowledge assistance",
		tag: "DISCOVER",
		description:
			"Organize information, generate options, and move from scattered thoughts to clear next steps.",
	},
	{
		icon: ShieldCheck,
		title: "Responsible by design",
		tag: "TRUST",
		description:
			"Build better habits around access, validation, and thoughtful use of AI-generated outputs.",
	},
];
function Features() {
	return (
		<main className="page-wrap px-4 py-14 sm:py-20">
			<div className="mx-auto max-w-3xl text-center">
				<div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300">
					<Sparkles size={14} /> ONAN AI capabilities
				</div>
				<h1 className="display-title mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
					Powerful tools. <span className="gradient-text">Practical outcomes.</span>
				</h1>
				<p className="mt-5 text-lg leading-8 text-[var(--sea-ink-soft)]">
					A thoughtful set of AI capabilities to help you explore, understand, create, and
					build—without adding complexity to your day.
				</p>
				<Link to="/login" className="primary-cta mt-7">
					Get started <ArrowRight size={17} />
				</Link>
			</div>
			<div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{items.map(({ icon: Icon, title, tag, description }) => (
					<article key={title} className="feature-card">
						<div className="flex items-center justify-between">
							<div className="feature-icon">
								<Icon size={22} />
							</div>
							<span className="text-[10px] font-extrabold tracking-[.16em] text-blue-600 dark:text-blue-300">
								{tag}
							</span>
						</div>
						<h2 className="mt-5 text-xl font-extrabold">{title}</h2>
						<p className="mt-3 text-sm leading-7 text-[var(--sea-ink-soft)]">{description}</p>
					</article>
				))}
			</div>
			<div className="mt-14 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-7 text-center sm:p-10">
				<h2 className="text-2xl font-extrabold">
					Your workflow is unique. Your tools should help.
				</h2>
				<p className="mx-auto mt-3 max-w-2xl leading-7 text-[var(--sea-ink-soft)]">
					Start with one use case, learn what works, and expand as your needs grow.
				</p>
				<Link to="/pricing" className="secondary-cta mt-6">
					Compare plans
				</Link>
			</div>
		</main>
	);
}
