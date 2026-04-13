import { ConfirmPopover } from "@/components/confirm-popover/confirm-popover";
import { DataTable } from "@/components/data-table/data-table";
import type { ColumnDef } from "@/components/data-table/data-table";
import { TruncatedText } from "@/components/tooltip/truncated-text";
import { useDeleteNazorat } from "@/hooks/teacher/useDeleteNazorat";
import { useModalActions } from "@/store/modalStore";
import { Badge } from "@/ui/badge";
import { Eye, Pencil, Trash2 } from "lucide-react";

export type Publication = {
	id: number;
	name: string;
	description: string;
	researcherName: string;
	university: string;
	year: string;
	level: "YUQORI" | "O'RTA" | "BOSHLANG'ICH";
	status: "JARAYONDA" | "TUGALLANGAN";
	pdfName: string | null;
};

const LEVEL_STYLES: Record<Publication["level"], string> = {
	YUQORI: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
	"O'RTA": "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
	"BOSHLANG'ICH": "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-50",
};

const columns: ColumnDef<Publication>[] = [
	{
		accessorKey: "name",
		header: "Nazorat nomi",
		cell: ({ row }) => <span className="font-medium text-[13px]">{row.getValue("name")}</span>,
	},
	{
		accessorKey: "description",
		header: "Tavsif",
		cell: ({ row }) => <TruncatedText text={row.getValue("description")} />,
	},
	{
		accessorKey: "researcherName",
		header: "Tadqiqotchi",
		cell: ({ row }) => <span className="text-[13px] text-muted-foreground">{row.getValue("researcher")}</span>,
	},
	{
		accessorKey: "year",
		header: "Yil",
		cell: ({ row }) => <span className="text-[13px] text-muted-foreground">{row.getValue("year")}</span>,
	},
	{
		accessorKey: "level",
		header: "Daraja",
		cell: ({ row }) => {
			const level = row.getValue("level") as Publication["level"];
			return (
				<Badge className={LEVEL_STYLES[level]} variant="outline">
					{level}
				</Badge>
			);
		},
	},
	{
		accessorKey: "status",
		header: "Holati",
		cell: ({ row }) => {
			const status = row.getValue("status") as Publication["status"];
			return (
				<Badge
					className={
						status === "TUGALLANGAN"
							? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
							: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50"
					}
					variant="outline"
				>
					{status}
				</Badge>
			);
		},
	},
	{
		accessorKey: "pdfName",
		header: "PDF",
		cell: ({ row }) => {
			const pdfName = row.getValue("pdfName") as string | null;
			if (!pdfName) return <span className="text-[12px] text-muted-foreground">—</span>;
			return (
				<button
					type="button"
					className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-[12px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
				>
					<Eye className="size-3" />
					Ko'rish
				</button>
			);
		},
	},
	{
		id: "actions",
		header: () => <div className="text-center">Amallar</div>,
		cell: ({ row }) => (
			<div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
				<button
					type="button"
					onClick={() => console.log("edit", row.original)}
					className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[12px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
				>
					<Pencil className="size-3" />
					Tahrirlash
				</button>
				<ConfirmPopover onConfirm={() => console.log("delete", row.original)}>
					<button
						type="button"
						className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-[12px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
					>
						<Trash2 className="size-3" />
						O'chirish
					</button>
				</ConfirmPopover>
			</div>
		),
	},
];

type nazoratsTabProps = {
	data: Publication[];
	userId: number;
	page: number;
	totalPage: number;
	onPageChange: (page: number) => void;
	isLoading: boolean;
};

export function NazoratTab({ data, page, totalPage, onPageChange, isLoading }: nazoratsTabProps) {
	const { open } = useModalActions();
	const {mutate:deleteNazorat}=useDeleteNazorat()

	const cols: ColumnDef<Publication>[] = columns.map((col) => {
		if ("id" in col && col.id === "actions") {
			return {
				...col,
				cell: ({ row }) => (
					<div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
						<button
							type="button"
							onClick={() => open({ _type: "nazorat", ...row.original })}
							className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[12px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
						>
							<Pencil className="size-3" />
							Tahrirlash
						</button>
						<ConfirmPopover onConfirm={()=>deleteNazorat(row.original.id)}>
							<button
								type="button"
								className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-[12px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
							>
								<Trash2 className="size-3" />
								O'chirish
							</button>
						</ConfirmPopover>
					</div>
				),
			};
		}
		return col;
	});

	return <DataTable columns={cols} data={data} />;
}
