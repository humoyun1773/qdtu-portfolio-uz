import { Pencil, Trash2, Plus, X, GraduationCap, Image as ImageIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import { ConfirmPopover } from "@/components/confirm-popover/confirm-popover";
import type { ColumnDef } from "@/components/data-table/data-table";
import { DataTable } from "@/components/data-table/data-table";
import { FileInput } from "@/components/file-input/file-input";
import { Modal } from "@/components/modal/modal";
import { TableToolbar } from "@/components/table-toolbar/table-toolbar";
import type { Collage } from "@/features/collage/collage.type";
import { useCollage } from "@/hooks/collage/useCollage";
import { useCreateCollage } from "@/hooks/collage/useCreateCollage";
import { useDeleteCollage } from "@/hooks/collage/useDeleteCollage";
import { useUpdateCollage } from "@/hooks/collage/useEditCollage";
import { useModalActions, useModalEditData, useModalIsOpen } from "@/store/modalStore";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";

type FacultyFormValues = {
	name: string;
	image: File | null;
};

function createColumns(
	onEdit: (row: Collage) => void,
	onDelete: (row: Collage) => void,
	page: number,
	onImageClick: (imageUrl: string) => void,
): ColumnDef<Collage>[] {
	return [
		{
			accessorKey: "id",
			header: "#",
			cell: ({ row }) => (
				<span className="text-muted-foreground/70 font-medium tabular-nums text-sm">{page * 10 + row.index + 1}</span>
			),
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
					<div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shadow-sm uppercase">
						{row.original.name.charAt(0)}
					</div>
				);
			},
		},
		{
			accessorKey: "name",
			header: "Fakultet nomi",
			cell: ({ row }) => (
				<div className="flex flex-col">
					<span className="font-semibold text-foreground tracking-tight">{row.getValue("name")}</span>
					<span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
						Oliy ta'lim bo'limi
					</span>
				</div>
			),
		},
		{
			id: "actions",
			header: () => <div className="text-right pr-4">Amallar</div>,
			cell: ({ row }) => (
				<div className="flex items-center justify-end gap-2 pr-2">
					<button
						type="button"
						onClick={() => onEdit(row.original)}
						className="p-2 flex items-center gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all active:scale-95 text-sm font-medium"
						title="Tahrirlash"
					>
						<Pencil className="size-4" />
						Tahrirlash
					</button>
					<ConfirmPopover onConfirm={() => onDelete(row.original)}>
						<button
							type="button"
							className="p-2 flex items-center gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all active:scale-95 text-sm font-medium"
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

export default function Faculties() {
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [searchParams, setSearchParams] = useSearchParams();
	const page = Number(searchParams.get("page") ?? 0);
	const search = searchParams.get("name") ?? "";

	const setPage = (newPage: number) => {
		setSearchParams((prev) => {
			const next = new URLSearchParams(prev);
			next.set("page", String(newPage));
			return next;
		});
	};

	const setSearch = (value: string) => {
		setSearchParams(
			(prev) => {
				const next = new URLSearchParams(prev);
				if (value) next.set("name", value);
				else next.delete("name");
				next.set("page", "0");
				return next;
			},
			{ replace: true },
		);
	};

	const isOpen = useModalIsOpen();
	const editData = useModalEditData() as Collage | null;
	const { open, close } = useModalActions();
	const isEdit = !!editData;

	const { data: collageResponse, isLoading, refetch } = useCollage();
	const { mutate: createCollage, isPending: isCreating } = useCreateCollage();
	const { mutate: deleteCollage } = useDeleteCollage();
	const { mutate: updateCollage, isPending: isUpdating } = useUpdateCollage();
	const isPending = isCreating || isUpdating;

	const collages: Collage[] = collageResponse?.data ?? [];
	const filteredCollages = collages.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
	const totalElements = filteredCollages.length;
	const totalPage = Math.ceil(totalElements / 10);

	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors },
	} = useForm<FacultyFormValues>({
		defaultValues: { name: "", image: null },
	});

	useEffect(() => {
		if (editData) reset({ name: editData.name, image: null });
		else reset({ name: "", image: null });
	}, [editData, reset]);

	const columns = useMemo(
		() =>
			createColumns(
				(row) => open(row),
				(row) => deleteCollage(row.id, { onSuccess: () => refetch() }),
				page,
				setPreviewImage,
			),
		[open, deleteCollage, page, refetch],
	);

	const handleClose = () => {
		reset();
		close();
	};

	const onSubmit = (values: FacultyFormValues) => {
		const onSuccess = () => {
			handleClose();
			refetch();
		};
		if (isEdit && editData) {
			updateCollage(
				{ id: editData.id, data: { name: values.name, ...(values.image && { image: values.image }) } },
				{ onSuccess },
			);
		} else if (values.image) {
			createCollage(values, { onSuccess });
		}
	};

	return (
		<div className="space-y-6 p-1 md:p-2 animate-in fade-in duration-300">
			{/* Notion-style Toolbar */}
			<div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-4 shadow-sm">
				<TableToolbar
					countLabel="Umumiy fakultetlar"
					count={totalElements}
					searchValue={search}
					onSearchChange={setSearch}
					onAdd={() => open()}
					addLabel="Fakultet qo'shish"
				/>
			</div>

			{/* Structured DataTable */}
			<div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
				<DataTable
					columns={columns}
					data={filteredCollages.slice(page * 10, page * 10 + 10)}
					isLoading={isLoading}
					page={page}
					totalPage={totalPage}
					onPageChange={setPage}
				/>
			</div>

			{/* Image Preview Overlay */}
			{previewImage && (
				<div
					className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in"
					onClick={() => setPreviewImage(null)}
				>
					<div className="relative max-w-lg w-full aspect-square scale-up-center" onClick={(e) => e.stopPropagation()}>
						<img
							src={previewImage}
							alt="Preview"
							className="w-full h-full rounded-3xl object-cover shadow-2xl ring-4 ring-background"
						/>
						<button
							className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-full p-2.5 shadow-lg hover:scale-110 transition-transform"
							onClick={() => setPreviewImage(null)}
						>
							<X className="size-5" />
						</button>
					</div>
				</div>
			)}

			{/* Styled Modal Form */}
			<Modal open={isOpen} onClose={handleClose} title={isEdit ? "Fakultetni tahrirlash" : "Yangi fakultet qo'shish"}>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
					<div className="space-y-4">
						<div className="space-y-2">
							<Label className="text-sm font-semibold">Fakultet logotipi</Label>
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

						<div className="space-y-2">
							<Label htmlFor="fac-name" className="text-sm font-semibold">
								Fakultet nomi
							</Label>
							<Input
								id="fac-name"
								className="h-11 rounded-xl bg-secondary/30 focus-visible:ring-primary/30 font-medium"
								placeholder="Masalan: Davolash fakulteti"
								{...register("name", { required: "Fakultet nomini kiriting" })}
							/>
							{errors.name && <p className="text-[12px] font-medium text-destructive mt-1">{errors.name.message}</p>}
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
							{isPending ? "Saqlanmoqda..." : isEdit ? "O'zgarishlarni saqlash" : "Fakultetni yaratish"}
						</Button>
					</div>
				</form>
			</Modal>
		</div>
	);
}
