import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";
import { cn } from "@/utils";

interface TruncatedTextProps {
	text: string;
	maxLength?: number;
	className?: string;
	tooltipClassName?: string;
}

export function TruncatedText({ text, maxLength = 55, className, tooltipClassName }: TruncatedTextProps) {
	if (text.length <= maxLength) {
		return <span className={cn("text-[13px] text-muted-foreground", className)}>{text}</span>;
	}

	return (
		<Tooltip delayDuration={100}>
			<TooltipTrigger asChild>
				<span
					className={cn(
						"text-[13px] text-muted-foreground cursor-pointer underline decoration-dashed underline-offset-4 decoration-muted-foreground/50 hover:text-foreground transition-colors",
						className,
					)}
				>
					{text.slice(0, maxLength).trim()}...
				</span>
			</TooltipTrigger>
			<TooltipContent
				side="top"
				className={cn("max-w-[200px] whitespace-normal leading-relaxed text-[12px]", tooltipClassName)}
			>
				{text}
			</TooltipContent>
		</Tooltip>
	);
}
