import { DataTable } from "@/components/data-table/data-table";
import type { ColumnDef } from "@/components/data-table/data-table";
import { ConfirmPopover } from "@/components/confirm-popover/confirm-popover";
import { FileInput } from "@/components/file-input/file-input";
import { Modal } from "@/components/modal/modal";
import { TableToolbar } from "@/components/table-toolbar/table-toolbar";
import { useModalActions, useModalEditData, useModalIsOpen } from "@/store/modalStore";
import { useCreateCollage } from "@/hooks/collage/useCreateCollage";
import { useCollage } from "@/hooks/collage/useCollage";
import { useDeleteCollage } from "@/hooks/collage/useDeleteCollage";
import { useUpdateCollage } from "@/hooks/collage/useEditCollage";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import type { Collage } from "@/features/collage/collage.type";

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
			cell: ({ row }) => <span className="text-muted-foreground">{page * 10 + row.index + 1}</span>,
		},
		{
			accessorKey: "imgUrl",
			header: "Rasm",
			cell: ({ row }) => {
				const imgUrl = row.original.imgUrl;
				return imgUrl ? (
					<img
						src={imgUrl}
						alt={row.original.name}
						className="w-9 h-9 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
						onClick={() => onImageClick(imgUrl)}
					/>
				) : (
					<div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-[13px]">
						{row.original.name.charAt(0).toUpperCase()}
					</div>
				);
			},
		},
		{
			accessorKey: "name",
			header: "Fakultet",
			cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
		},
		{
			id: "actions",
			header: () => <div className="text-center">Amallar</div>,
			cell: ({ row }) => (
				<div className="flex items-center justify-center gap-2">
					<button
						type="button"
						onClick={() => onEdit(row.original)}
						className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[12px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
					>
						<Pencil className="size-3" />
						Tahrirlash
					</button>
					<ConfirmPopover onConfirm={() => onDelete(row.original)}>
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
		setSearchParams((prev) => {
			const next = new URLSearchParams(prev);
			if (value) next.set("name", value);
			else next.delete("name");
			next.set("page", "0");
			return next;
		});
	};

	const isOpen = useModalIsOpen();
	const editData = useModalEditData() as Collage | null;
	const { open, close } = useModalActions();
	const isEdit = editData !== null;

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
		if (isEdit && editData) {
			const data: any = { name: values.name };
			if (values.image) data.image = values.image;
			updateCollage(
				{ id: editData.id, data },
				{
					onSuccess: () => {
						handleClose();
						refetch();
					},
				},
			);
			return;
		}
		if (!values.image) return;
		createCollage(values, {
			onSuccess: () => {
				handleClose();
				refetch();
			},
		});
	};

	return (
		<div className="flex flex-col gap-4">
			<TableToolbar
				countLabel="Fakultetlar soni"
				count={totalElements}
				searchValue={search}
				onSearchChange={setSearch}
				onAdd={() => open()}
				addLabel="Fakultet qo'shish"
			/>

			<DataTable
				columns={columns}
				data={filteredCollages.slice(page * 10, page * 10 + 10)}
				isLoading={isLoading}
				page={page}
				totalPage={totalPage}
				onPageChange={setPage}
			/>

			{previewImage && (
				<button
					type="button"
					className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 cursor-pointer w-full border-0"
					onClick={() => setPreviewImage(null)}
				>
					<div
						role="dialog"
						aria-modal="true"
						aria-label="Image preview"
						className="relative flex items-center justify-center"
						onClick={(e) => e.stopPropagation()}
					>
						<img src={previewImage} alt="Preview" className="w-96 h-96 rounded-full object-cover shadow-lg" />
					</div>
				</button>
			)}

			<Modal open={isOpen} onClose={handleClose} title={isEdit ? "Fakultet tahrirlash" : "Fakultet qo'shish"}>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 py-2">
					<div className="flex flex-col gap-2">
						<Label>Rasm</Label>
						<Controller
							name="image"
							control={control}
							rules={{ required: !isEdit && "Rasm tanlanishi shart" }}
							render={({ field }) => <FileInput type="image" value={field.value} onChange={field.onChange} />}
						/>
						{errors.image && <span className="text-[12px] text-red-500">{errors.image.message}</span>}
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="faculty-name">Fakultet nomi</Label>
						<Input
							id="faculty-name"
							placeholder="Masalan: Davolash fakulteti"
							{...register("name", { required: "Fakultet nomi kiritilishi shart" })}
						/>
						{errors.name && <span className="text-[12px] text-red-500">{errors.name.message}</span>}
					</div>

					<div className="flex justify-end gap-2">
						<Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
							Bekor qilish
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending ? "Yuklanmoqda..." : isEdit ? "Saqlash" : "Qo'shish"}
						</Button>
					</div>
				</form>
			</Modal>
		</div>
	);
}
