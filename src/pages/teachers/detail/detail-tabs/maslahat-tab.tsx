import { ConfirmPopover } from "@/components/confirm-popover/confirm-popover";
import { DataTable } from "@/components/data-table/data-table";
import type { ColumnDef } from "@/components/data-table/data-table";
import { TruncatedText } from "@/components/tooltip/truncated-text";
import { useDeleteMaslahat } from "@/hooks/teacher/useDeleteMaslahat";
import { useModalActions } from "@/store/modalStore";
import { Badge } from "@/ui/badge";
import { Eye, Pencil, Trash2 } from "lucide-react";

export type Maslahat = {
	id: number;
	name: string;
	description: string;
	year: number;
	leader: string;
	member: boolean;
	finishedEnum: "COMPLETED" | "IN_PROGRESS" | "FINISHED";
	fileUrl: string | null;
};

const FINISHED_ENUM_MAP: Record<string, string> = {
	COMPLETED: "Tugallangan",
	IN_PROGRESS: "Jarayonda",
	FINISHED: "Yakunlangan",
};

const STYLE_MAP: Record<string, string> = {
	COMPLETED: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50",
	IN_PROGRESS: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-50",
	FINISHED: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
};

type MaslahatTabProps = {
	data: Maslahat[];
	userId: number;
	page: number;
	totalPage: number;
	onPageChange: (page: number) => void;
	isLoading: boolean;
};

export function MaslahatTab({ data, page, totalPage, onPageChange, isLoading }: MaslahatTabProps) {
	const { open } = useModalActions();
	const { mutate: deleteMaslahat } = useDeleteMaslahat();

	const columns: ColumnDef<Maslahat>[] = [
		{
			accessorKey: "name",
			header: "Maslahat nomi",
			cell: ({ row }) => <span className="font-medium text-[13px]">{row.original.name}</span>,
		},
		{
			accessorKey: "description",
			header: "Tavsif",
			cell: ({ row }) => <TruncatedText text={row.original.description} />,
		},
		{
			accessorKey: "year",
			header: "Yil",
			cell: ({ row }) => <span className="text-[13px] text-muted-foreground">{row.original.year}</span>,
		},
		{
			accessorKey: "leader",
			header: "Rahbar",
			cell: ({ row }) => <span className="text-[13px]">{row.original.leader}</span>,
		},
		{
			accessorKey: "member",
			header: "A'zolik",
			cell: ({ row }) => {
				const val = row.original.member;
				return (
					<Badge
						className={val
							? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
							: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50"
						}
						variant="outline"
					>
						{val ? "Ha" : "Yo'q"}
					</Badge>
				);
			},
		},
		{
			accessorKey: "finishedEnum",
			header: "Holati",
			cell: ({ row }) => {
				const val = row.original.finishedEnum;
				return (
					<Badge className={STYLE_MAP[val]} variant="outline">
						{FINISHED_ENUM_MAP[val]}
					</Badge>
				);
			},
		},
		{
			accessorKey: "fileUrl",
			header: "PDF",
			cell: ({ row }) => {
				const fileUrl = row.original.fileUrl;
				if (!fileUrl) return <span className="text-[12px] text-muted-foreground">—</span>;
				return (
					<a
						href={fileUrl}
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-[12px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
					>
						<Eye className="size-3" /> Ko'rish
					</a>
				);
			},
		},
		{
			id: "actions",
			header: () => <div className="text-center">Amallar</div>,
			cell: ({ row }) => (
				<div
					className="flex items-center justify-center gap-2"
					role="button"
					tabIndex={0}
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") e.stopPropagation();
					}}
				>
					<button
						type="button"
						onClick={() => open({ _type: "maslahat", ...row.original })}
						className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[12px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
					>
						<Pencil className="size-3" /> Tahrirlash
					</button>
					<ConfirmPopover onConfirm={() => deleteMaslahat(row.original.id)}>
						<button
							type="button"
							className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-[12px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
						>
							<Trash2 className="size-3" /> O'chirish
						</button>
					</ConfirmPopover>
				</div>
			),
		},
	];

	return <DataTable columns={columns} data={data} />;
}