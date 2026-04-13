import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { cn } from "@/utils";

export type SearchableSelectOption = {
	value: string;
	label: string;
};

type SearchableSelectProps = {
	options: SearchableSelectOption[];
	value: string | number;
	onChange: (value: string) => void;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyText?: string;
};

export function SearchableSelect({
	options,
	value,
	onChange,
	placeholder = "Tanlang...",
	searchPlaceholder = "Qidirish...",
	emptyText = "Natija topilmadi.",
}: SearchableSelectProps) {
	const [open, setOpen] = useState(false);

	const selected = options.find((o) => o.value === value);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between font-normal">
					{selected ? selected.label : placeholder}
					<ChevronsUpDown className="size-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0" align="start">
				<Command>
					<CommandInput placeholder={searchPlaceholder} />
					<CommandList>
						<CommandEmpty>{emptyText}</CommandEmpty>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem
									key={option.value}
									value={option.label}
									onSelect={() => {
										onChange(option.value);
										setOpen(false);
									}}
								>
									{option.label}
									<Check className={cn("ml-auto size-4", value === option.value ? "opacity-100" : "opacity-0")} />
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
