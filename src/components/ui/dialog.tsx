import { cn } from "@/lib/utils";
import { Dialog as DialogPrimitive } from "radix-ui";
import * as React from "react";

const DialogRoot = React.forwardRef<
	React.ComponentRef<typeof DialogPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>
>((props, ref) => <DialogPrimitive.Root ref={ref} {...props} />);

DialogRoot.displayName = DialogPrimitive.Root.displayName;

const DialogTrigger = React.forwardRef<
	React.ComponentRef<typeof DialogPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>((props, ref) => <DialogPrimitive.Trigger ref={ref} {...props} />);

DialogTrigger.displayName = DialogPrimitive.Trigger.displayName;

const DialogContent = React.forwardRef<
	React.ComponentRef<typeof DialogPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<DialogPrimitive.Portal>
		<DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
		<DialogPrimitive.Content
			ref={ref}
			className={cn(
				"fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
				"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:[width:100%] sm:[max-w:2xl]",
				className,
			)}
			{...props}
		>
			{children}
			<DialogPrimitive.Close
				className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
				aria-label="Close"
			>
				<CloseIcon className="[&_svg]:size-5" />
			</DialogPrimitive.Close>
		</DialogPrimitive.Content>
	</DialogPrimitive.Portal>
));

DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogTitle = React.forwardRef<
	React.ComponentRef<typeof DialogPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>((props, ref) => (
	<DialogPrimitive.Title
		ref={ref}
		className="text-lg font-semibold leading-none tracking-tight"
		{...props}
	/>
));

DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogHeader = React.forwardRef<
	React.ComponentRef<typeof HTMLDivElement>,
	React.ComponentPropsWithoutRef<typeof HTMLDivElement>
>(({ className, children, ...props }, ref) => (
	<div ref={ref} className={cn("flex flex-col space-y-1.5 text-sm", className)} {...props}>
		{children}
	</div>
));

DialogHeader.displayName = "DialogHeader";

const DialogDescription = React.forwardRef<
	React.ComponentRef<typeof DialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>((props, ref) => (
	<DialogPrimitive.Description ref={ref} className="text-sm text-muted-foreground" {...props} />
));

DialogDescription.displayName = DialogPrimitive.Description.displayName;

const DialogFooter = React.forwardRef<
	React.ComponentRef<typeof HTMLDivElement>,
	React.ComponentPropsWithoutRef<typeof HTMLDivElement>
>(({ className, children, ...props }, ref) => (
	<div ref={ref} className={cn("flex flex-row-reverse gap-2", className)} {...props}>
		{children}
	</div>
));

DialogFooter.displayName = "DialogFooter";

function CloseIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-label="Close"
			className={className}
		>
			<title>Close</title>
			<line x1="18" y1="6" x2="6" y2="18" />
			<line x1="6" y1="6" x2="18" y2="18" />
		</svg>
	);
}

export {
	DialogRoot as Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
	DialogDescription,
	DialogHeader,
	DialogFooter,
};
