import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";

export type { ColumnDef };

const PAGE_SIZE = 10;

type DataTableProps<T> = {
	columns: ColumnDef<T>[];
	data: T[];
	onRowClick?: (row: T) => void;
};

export function DataTable<T>({ columns, data, onRowClick }: DataTableProps<T>) {
	const [pageIndex, setPageIndex] = useState(0);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: { pagination: { pageIndex, pageSize: PAGE_SIZE } },
		onPaginationChange: (updater) => {
			const next = typeof updater === "function" ? updater({ pageIndex, pageSize: PAGE_SIZE }) : updater;
			setPageIndex(next.pageIndex);
		},
		manualPagination: false,
	});

	const totalPages = table.getPageCount();
	const showPagination = data.length > PAGE_SIZE;

	return (
		<div className="flex flex-col gap-3">
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									onClick={() => onRowClick?.(row.original)}
									className={onRowClick ? "cursor-pointer hover:bg-muted/10" : ""}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									Ma'lumot topilmadi.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{showPagination && (
				<div className="flex items-center justify-between px-1">
					<span className="text-[13px] text-muted-foreground">
						Jami {data.length} ta | {pageIndex + 1} / {totalPages} sahifa
					</span>

					<div className="flex items-center gap-1">
						<Button
							variant="outline"
							size="icon"
							className="h-8 w-8"
							onClick={() => setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<ChevronsLeft className="size-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="h-8 w-8"
							onClick={() => setPageIndex((p) => p - 1)}
							disabled={!table.getCanPreviousPage()}
						>
							<ChevronLeft className="size-4" />
						</Button>

						{Array.from({ length: totalPages }, (_, i) => i).map((i) => (
							<Button
								key={i}
								variant={i === pageIndex ? "default" : "outline"}
								size="icon"
								className="h-8 w-8 text-[13px]"
								onClick={() => setPageIndex(i)}
							>
								{i + 1}
							</Button>
						))}

						<Button
							variant="outline"
							size="icon"
							className="h-8 w-8"
							onClick={() => setPageIndex((p) => p + 1)}
							disabled={!table.getCanNextPage()}
						>
							<ChevronRight className="size-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="h-8 w-8"
							onClick={() => setPageIndex(totalPages - 1)}
							disabled={!table.getCanNextPage()}
						>
							<ChevronsRight className="size-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
