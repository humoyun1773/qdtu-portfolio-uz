import { Plus, Search } from "lucide-react";

type TableToolbarProps = {
	count?: number;
	countLabel?: string;
	searchValue: string;
	onSearchChange: (value: string) => void;
	onAdd?: () => void;
	addLabel?: string;
	showSearch?: boolean;
};

export function TableToolbar({
	count,
	countLabel,
	searchValue,
	onSearchChange,
	onAdd,
	addLabel = "Qo'shish",
	showSearch = true,
}: TableToolbarProps) {
	return (
		<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3.5 bg-blue border border-border/50 rounded-2xl">
			{countLabel !== undefined && (
				<div className="flex items-center gap-2.5">
					<span className="text-[13px] font-medium text-muted-foreground">{countLabel}</span>
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold font-mono bg-primary/8 text-primary border border-primary/15">
						{count ?? 0}
					</span>
				</div>
			)}

			<div className="flex items-center gap-2 w-full sm:w-auto">
				{showSearch && (
					<div className="relative flex-1 sm:w-56">
						<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60" />
						<input
							placeholder="Qidirish..."
							value={searchValue}
							onChange={(e) => onSearchChange(e.target.value)}
							className="w-full h-9 pl-8 pr-3 text-[13px] bg-muted/50 border border-border/50 rounded-xl outline-none focus:border-border focus:bg-background transition-colors placeholder:text-muted-foreground/50"
						/>
					</div>
				)}

				{onAdd && (
					<button
						onClick={onAdd}
						className="flex items-center cursor-pointer gap-1.5 h-9 px-3.5 rounded-lg bg-blue-600 text-white text-[13px] font-medium shrink-0 hover:bg-blue-700 active:scale-[.98] transition-all"
					>
						<Plus className="size-3.5" />
						{addLabel}
					</button>
				)}
			</div>
		</div>
	);
}
