import { FilePenLine, Search, UserPlus, UserX, X } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ConfirmPopover } from "@/components/confirm-popover/confirm-popover";
import type { ColumnDef } from "@/components/data-table/data-table";
import { DataTable } from "@/components/data-table/data-table";
import type { Teacher } from "@/features/teacher/teacher.type";
import { useDepartment } from "@/hooks/department/useDepartment";
import { usePosition } from "@/hooks/position/usePosition";
import { useDeleteTeacher } from "@/hooks/teacher/useDeleteTeacher";
import { useTeacher } from "@/hooks/teacher/useTeacher";
import { useTeacherSheetActions } from "@/store/teacherSheet";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { TeacherSheet } from "./teacher-sheet";

// Column yaratish funksiyasi
function createColumns(
	onEdit: (row: Teacher) => void,
	onDelete: (row: Teacher) => void,
	isDeleting: boolean,
	page: number,
): ColumnDef<Teacher>[] {
	return [
		{
			accessorKey: "id",
			header: "#",
			cell: ({ row }) => (
				<span className="text-[12px] text-muted-foreground/50 tabular-nums">
					{String(page * 10 + row.index + 1).padStart(2, "0")}
				</span>
			),
		},
		{
			accessorKey: "fullName",
			header: "F.I.Sh.",
			cell: ({ row }) => {
				const teacher = row.original;
				return (
					<div className="flex items-center gap-2">
						{teacher.imgUrl ? (
							<img src={teacher.imgUrl} alt={teacher.fullName} className="w-7 h-7 rounded-full object-cover shrink-0" />
						) : (
							<div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-[12px] shrink-0">
								{teacher.fullName.charAt(0).toUpperCase()}
							</div>
						)}
						<span className="font-medium text-[12px] truncate">{teacher.fullName}</span>
					</div>
				);
			},
		},
		{
			accessorKey: "phoneNumber",
			header: "Telefon",
			cell: ({ row }) => (
				<span className="text-muted-foreground text-[12px]">{row.getValue("phoneNumber") || "—"}</span>
			),
		},
		{
			accessorKey: "lavozim",
			header: "Lavozim",
			cell: ({ row }) => (
				<span className="inline-flex items-center bg-blue-50 text-blue-700 text-[11px] font-medium px-2 py-0.5 rounded-full truncate">
					{row.getValue("lavozim") || "—"}
				</span>
			),
		},
		{
			accessorKey: "departmentName",
			header: "Kafedra",
			cell: ({ row }) => (
				<span className="text-muted-foreground text-[12px] truncate">{row.getValue("departmentName") || "—"}</span>
			),
		},
		{
			id: "actions",
			header: () => <div className="text-center text-[12px]">Amallar</div>,
			cell: ({ row }) => (
				<div className="flex items-center justify-center gap-1.5">
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onEdit(row.original);
						}}
						className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors cursor-pointer"
					>
						<FilePenLine className="size-3" />
						Tahrirlash
					</button>
					<ConfirmPopover
						onConfirm={() => {
							if (isDeleting) return;
							onDelete(row.original);
						}}
					>
						<button
							type="button"
							onClick={(e) => e.stopPropagation()}
							disabled={isDeleting}
							className="inline-flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors cursor-pointer"
						>
							<UserX className="size-3" />
							{isDeleting ? "..." : "O'chirish"}
						</button>
					</ConfirmPopover>
				</div>
			),
		},
	];
}

export default function Teachers() {
	const { open } = useTeacherSheetActions();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	// URL parametrlari
	const page = Number(searchParams.get("page") ?? 0);
	const searchName = searchParams.get("name") ?? "";
	const selectedDepartment = searchParams.get("dept") ?? "all";
	const selectedPosition = searchParams.get("pos") ?? "all";

	// API chaqiruvi
	const { data: response, isLoading, refetch } = useTeacher(page);
	const { data: departmentResponse } = useDepartment();
	const { data: positionResponse } = usePosition();
	const { mutate: deleteTeacher, isPending: isDeletePending } = useDeleteTeacher();

	// Ma'lumotlarni formatlash
	const teachers: Teacher[] = response?.data?.body ?? [];
	const totalPage = response?.data?.totalPage ?? 0;
	const totalElements = response?.data?.totalElements ?? 0;

	const setPage = (newPage: number) => {
		setSearchParams((prev) => {
			prev.set("page", String(newPage));
			return prev;
		});
	};

	const updateFilter = (key: string, value: string) => {
		setSearchParams((prev) => {
			if (value && value !== "all") prev.set(key, value);
			else prev.delete(key);
			prev.set("page", "0");
			return prev;
		});
	};

	const departments = useMemo(() => {
		const depts = [{ value: "all", label: "Barcha kafedralar" }];
		if (departmentResponse?.data && Array.isArray(departmentResponse.data)) {
			departmentResponse.data.forEach((d: any) => depts.push({ value: String(d.id), label: d.name }));
		}
		return depts;
	}, [departmentResponse]);

	const positions = useMemo(() => {
		const pos = [{ value: "all", label: "Barcha lavozimlar" }];
		if (positionResponse?.data && Array.isArray(positionResponse.data)) {
			positionResponse.data.forEach((p: any) => pos.push({ value: String(p.id), label: p.name }));
		}
		return pos;
	}, [positionResponse]);

	const clearFilters = () => setSearchParams(new URLSearchParams());
	const hasActiveFilters = searchName !== "" || selectedDepartment !== "all" || selectedPosition !== "all";

	const columns = useMemo(
		() =>
			createColumns(
				(row) => open(row),
				(row) => deleteTeacher(row.id, { onSuccess: () => refetch() }),
				isDeletePending,
				page,
			),
		[open, deleteTeacher, isDeletePending, page, refetch],
	);

	return (
		<div className="flex flex-col gap-4">
			{/* Header section */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-1.5">
					<span className="text-[13px] font-semibold text-foreground">O'qituvchilar soni:</span>
					<span className="bg-blue-100 text-blue-700 text-[12px] font-bold px-2 py-0.5 rounded-full">
						{totalElements}
					</span>
					{hasActiveFilters && (
						<button
							type="button"
							onClick={clearFilters}
							className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors ml-2 cursor-pointer"
						>
							<X className="size-3" /> Filtrlarni tozalash
						</button>
					)}
				</div>
				<Button
					size="sm"
					className="h-8 gap-1 text-[12px] bg-blue-600 hover:bg-blue-700 text-white"
					onClick={() => open()}
				>
					<UserPlus className="size-3.5" /> O'qituvchi qo'shish
				</Button>
			</div>

			{/* Filter section */}
			<div className="flex flex-wrap items-end gap-3 p-4 bg-muted/30 rounded-lg border">
				<div className="flex-1 min-w-48">
					<Label htmlFor="search-name" className="text-[11px] font-medium text-muted-foreground mb-1 block">
						Qidirish
					</Label>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
						<Input
							id="search-name"
							placeholder="F.I.Sh. bo'yicha..."
							value={searchName}
							onChange={(e) => updateFilter("name", e.target.value)}
							className="pl-9 h-9 text-[13px]"
						/>
					</div>
				</div>

				<div className="w-48">
					<Label className="text-xs font-medium text-muted-foreground mb-1 block">Kafedra</Label>
					<Select value={selectedDepartment} onValueChange={(v) => updateFilter("dept", v)}>
						<SelectTrigger className="h-9 text-[13px]">
							<SelectValue placeholder="Kafedra tanlang" />
						</SelectTrigger>
						<SelectContent>
							{departments.map((dept) => (
								<SelectItem key={dept.value} value={dept.value} className="text-[13px]">
									{dept.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="w-48">
					<Label className="text-xs font-medium text-muted-foreground mb-1 block">Lavozim</Label>
					<Select value={selectedPosition} onValueChange={(v) => updateFilter("pos", v)}>
						<SelectTrigger className="h-9 text-[13px]">
							<SelectValue placeholder="Lavozim tanlang" />
						</SelectTrigger>
						<SelectContent>
							{positions.map((pos) => (
								<SelectItem key={pos.value} value={pos.value} className="text-[13px]">
									{pos.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Table section */}
			<DataTable
				columns={columns}
				data={teachers}
				page={page}
				totalPage={totalPage}
				onPageChange={setPage}
				isLoading={isLoading}
				onRowClick={(row) => {
					if (isDeletePending) return;
					navigate(`/teacher/${row.id}`, { state: { teacher: row } });
				}}
			/>

			<TeacherSheet />
		</div>
	);
}
