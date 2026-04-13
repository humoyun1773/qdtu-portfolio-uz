import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import type { ReactNode } from "react";

type ModalProps = {
	open: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
};

export function Modal({ open, onClose, title, children }: ModalProps) {
	return (
		<Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	);
}
