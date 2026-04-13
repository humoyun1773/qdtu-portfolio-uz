import { Button } from "@/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import type { ReactNode } from "react";
import { useState } from "react";

type ConfirmPopoverProps = {
	onConfirm: () => void;
	children: ReactNode;
	message?: string;
};

export function ConfirmPopover({ children, onConfirm, message = "O'chirishni xoxlaysizmi?" }: ConfirmPopoverProps) {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent>
				<p className="text-[13px] font-medium mb-3">{message}</p>
				<div className="flex items-center justify-end gap-2">
					<Button className="cursor-pointer" size={"sm"} value={"outline"} onClick={() => setOpen(false)}>
						Yo'q
					</Button>
					<Button
						size="sm"
						variant="destructive"
						className="cursor-pointer"
						onClick={(e) => {
							e.stopPropagation();
							onConfirm();
							setOpen(false);
						}}
					>
						Ha
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
