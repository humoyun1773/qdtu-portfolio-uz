import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import { ConfirmPopover } from "@/components/confirm-popover/confirm-popover";
import type { ColumnDef } from "@/components/data-table/data-table";
import { DataTable } from "@/components/data-table/data-table";
import { FileInput } from "@/components/file-input/file-input";
import { Modal } from "@/components/modal/modal";
import { SearchableSelect } from "@/components/searchable-select/searchable-select";
import { TableToolbar } from "@/components/table-toolbar/table-toolbar";
import type { Collage } from "@/features/collage/collage.type";
import type { Department } from "@/features/departments/department.type";
import { useCollage } from "@/hooks/collage/useCollage";
import { useCreateDepartment } from "@/hooks/department/useCreateDepartment";
import { useDeleteDepartment } from "@/hooks/department/useDeleteDepartment";
import { useDepartment } from "@/hooks/department/useDepartment";
import { useUpdateDepartment } from "@/hooks/department/useEditDepartment";
import { useModalActions, useModalEditData, useModalIsOpen } from "@/store/modalStore";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";

type DepartmentFormValues = {
	name: string;
	departmentId: string | number;
	image: File | null;
};

function createColumns(
	onEdit: (row: Department) => void,
	onDelete: (row: Department) => void,
	onImageClick: (imageUrl: string) => void,
	collages: Collage[],
): ColumnDef<Department>[] {
	return [
		{
			accessorKey: "id",
			header: "#",
			cell: ({ row }) => <span className="text-muted-foreground/70 font-medium">{row.index + 1}</span>,
		},
		{
			accessorKey: "imgUrl",
			header: "Rasm",
			cell: ({ row }) => {
				const imgUrl = row.original.imgUrl;
				return imgUrl ? (
					<div className="relative group w-10 h-10">
						<img
							src={imgUrl}
							alt={row.original.name}
							className="w-full h-full rounded-xl object-cover ring-1 ring-border group-hover:ring-primary/50 transition-all cursor-pointer shadow-sm"
							onClick={() => onImageClick(imgUrl)}
						/>
					</div>
				) : (
					<div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shadow-sm">
						{row.original.name.charAt(0).toUpperCase()}
					</div>
				);
			},
		},
		{
			accessorKey: "name",
			header: "Kafedra",
			cell: ({ row }) => (
				<div className="flex flex-col">
					<span className="font-semibold text-foreground tracking-tight">{row.getValue("name")}</span>
					<span className="text-[11px] text-muted-foreground lg:hidden">
						{collages.find((c) => c.id === row.original.collegeId)?.name}
					</span>
				</div>
			),
		},
		{
			accessorKey: "collegeId",
			header: "Fakulteti",
			cell: ({ row }) => {
				const college = collages.find((c) => c.id === row.original.collegeId);
				return (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
						{college?.name ?? "—"}
					</span>
				);
			},
		},
		{
			id: "actions",
			header: () => <div className="text-right pr-4">Amallar</div>,
			cell: ({ row }) => (
				<div className="flex items-center justify-end gap-2 pr-2">
					<button
						type="button"
						onClick={() => onEdit(row.original)}
						className="p-2 flex gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all active:scale-95"
						title="Tahrirlash"
					>
						<Pencil className="size-4" />
						Tahrirlash
					</button>
					<ConfirmPopover onConfirm={() => onDelete(row.original)}>
						<button
							type="button"
							className="p-2 flex gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all active:scale-95"
							title="O'chirish"
						>
							<Trash2 className="size-4" />
							O'chirish
						</button>
					</ConfirmPopover>
				</div>
			),
		},
	];
}

export default function Departments() {
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [searchParams, setSearchParams] = useSearchParams();
	const search = searchParams.get("name") ?? "";

	const setSearch = (value: string) => {
		setSearchParams(
			(prev) => {
				const next = new URLSearchParams(prev);
				if (value) next.set("name", value);
				else next.delete("name");
				return next;
			},
			{ replace: true },
		);
	};

	const isOpen = useModalIsOpen();
	const editData = useModalEditData() as Department | null;
	const { open, close } = useModalActions();
	const isEdit = !!editData;

	const { data: departmentResponse, refetch } = useDepartment();
	const { mutate: createDepartment, isPending: isCreating } = useCreateDepartment();
	const { mutate: deleteDepartment } = useDeleteDepartment();
	const { mutate: updateDepartment, isPending: isUpdating } = useUpdateDepartment();
	const isPending = isCreating || isUpdating;

	const { data: collageResponse } = useCollage();
	const collages: Collage[] = collageResponse?.data ?? [];

	const facultyOptions = useMemo(() => collages.map((f) => ({ value: String(f.id), label: f.name })), [collages]);

	const departments: Department[] = departmentResponse?.data ?? [];
	const filteredDepartments = departments.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors },
	} = useForm<DepartmentFormValues>({
		defaultValues: { name: "", departmentId: "", image: null },
	});

	useEffect(() => {
		if (editData) {
			reset({
				name: editData.name,
				departmentId: editData.collegeId ? String(editData.collegeId) : "",
				image: null,
			});
		} else {
			reset({ name: "", departmentId: "", image: null });
		}
	}, [editData, reset]);

	const columns = useMemo(
		() =>
			createColumns(
				(row) => open(row),
				(row) => deleteDepartment(row.id, { onSuccess: () => refetch() }),
				setPreviewImage,
				collages,
			),
		[open, deleteDepartment, refetch, collages],
	);

	const handleClose = () => {
		reset();
		close();
	};

	const onSubmit = (values: DepartmentFormValues) => {
		const data: any = { name: values.name, collegeId: Number(values.departmentId) };
		if (values.image) data.image = values.image;

		if (isEdit && editData) {
			updateDepartment(
				{ id: editData.id, collegeId: Number(values.departmentId), data },
				{
					onSuccess: () => {
						handleClose();
						refetch();
					},
				},
			);
		} else {
			if (!values.image || !values.departmentId) return;
			createDepartment(
				{ name: values.name, collegeId: Number(values.departmentId), image: values.image },
				{
					onSuccess: () => {
						handleClose();
						refetch();
					},
				},
			);
		}
	};

	return (
		<div className="space-y-6 p-1 md:p-2">
			{/* Custom Toolbar Styling */}
			<div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-4 shadow-sm">
				<TableToolbar
					countLabel="Umumiy kafedralar"
					count={filteredDepartments.length}
					searchValue={search}
					onSearchChange={setSearch}
					onAdd={() => open()}
					addLabel="Kafedra qo'shish"
				/>
			</div>

			<div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
				<DataTable columns={columns} data={filteredDepartments} />
			</div>

			{/* Modern Image Preview */}
			{previewImage && (
				<div
					className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 transition-all animate-in fade-in duration-200"
					onClick={() => setPreviewImage(null)}
				>
					<div className="relative max-w-lg w-full aspect-square" onClick={(e) => e.stopPropagation()}>
						<img
							src={previewImage}
							alt="Preview"
							className="w-full h-full rounded-3xl object-cover shadow-2xl ring-4 ring-background"
						/>
						<button
							className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
							onClick={() => setPreviewImage(null)}
						>
							<Plus className="rotate-45 size-5" />
						</button>
					</div>
				</div>
			)}

			{/* Styled Modal Form */}
			<Modal open={isOpen} onClose={handleClose} title={isEdit ? "Kafedrani tahrirlash" : "Yangi kafedra qo'shish"}>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
					<div className="space-y-4">
						<div className="space-y-2">
							<Label className="text-sm font-semibold">Kafedra logotipi</Label>
							<Controller
								name="image"
								control={control}
								rules={{ required: !isEdit && "Rasm yuklash majburiy" }}
								render={({ field }) => (
									<div className="relative group">
										<FileInput type="image" value={field.value} onChange={field.onChange} />
										<div className="absolute inset-0 rounded-xl pointer-events-none border-2 border-dashed border-transparent group-hover:border-primary/20 transition-colors" />
									</div>
								)}
							/>
							{errors.image && <p className="text-[12px] font-medium text-destructive mt-1">{errors.image.message}</p>}
						</div>

						<div className="grid gap-4 md:grid-cols-1">
							<div className="space-y-2">
								<Label className="text-sm font-semibold">Tegishli fakultet</Label>
								<Controller
									name="departmentId"
									control={control}
									rules={{ required: "Fakultetni tanlang" }}
									render={({ field }) => (
										<SearchableSelect
											options={facultyOptions}
											value={field.value}
											onChange={field.onChange}
											placeholder="Fakultetni qidiring..."
										/>
									)}
								/>
								{errors.departmentId && (
									<p className="text-[12px] font-medium text-destructive mt-1">{errors.departmentId.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="department-name" className="text-sm font-semibold">
									Kafedra nomi
								</Label>
								<Input
									id="department-name"
									className="h-11 rounded-xl bg-secondary/30 focus-visible:ring-primary/30"
									placeholder="Masalan: Axborot texnologiyalari"
									{...register("name", { required: "Kafedra nomini kiriting" })}
								/>
								{errors.name && <p className="text-[12px] font-medium text-destructive mt-1">{errors.name.message}</p>}
							</div>
						</div>
					</div>

					<div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
						<Button type="button" variant="ghost" onClick={handleClose} disabled={isPending} className="rounded-xl">
							Bekor qilish
						</Button>
						<Button
							type="submit"
							disabled={isPending}
							className="rounded-xl px-8 shadow-lg shadow-primary/20 active:scale-95 transition-all"
						>
							{isPending ? "Saqlanmoqda..." : isEdit ? "O'zgarishlarni saqlash" : "Kafedrani yaratish"}
						</Button>
					</div>
				</form>
			</Modal>
		</div>
	);
}
