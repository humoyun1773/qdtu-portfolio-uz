import { Briefcase, Pencil, Trash2, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ConfirmPopover } from "@/components/confirm-popover/confirm-popover";
import { Modal } from "@/components/modal/modal";
import { TableToolbar } from "@/components/table-toolbar/table-toolbar";
import type { Position, PositionStatistic } from "@/features/position/position.type";
import { useCreatePosition } from "@/hooks/position/useCreatePosition";
import { useDeletePosition } from "@/hooks/position/useDeletePosition";
import { useUpdatePosition } from "@/hooks/position/useEditPosition";
import { usePosition } from "@/hooks/position/usePosition";
import { useStatsPosition } from "@/hooks/position/useStatsPosition";
import { useModalActions, useModalEditData, useModalIsOpen } from "@/store/modalStore";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";

type PositionFormValues = {
	name: string;
};
export default function Positions() {
	const [search, setSearch] = useState("");
	const isOpen = useModalIsOpen();
	const { close, open } = useModalActions();
	const editData = useModalEditData() as Position | null;
	const isEdit = editData !== null;
	const { data: positionResponse, refetch } = usePosition(search);
	const { data: statsResponse } = useStatsPosition();
	const { mutate: createPosition, isPending: isCreating } = useCreatePosition();
	const { mutate: updatePosition, isPending: isUpdating } = useUpdatePosition();
	const { mutate: deletePosition } = useDeletePosition();
	const isPending = isCreating || isUpdating;
	const positions: Position[] = positionResponse?.data ?? [];
	const visiblePositions = useMemo(() => {
		const term = search.trim().toLowerCase();
		if (!term) return positions;
		return positions.filter((position) => position.name.toLowerCase().includes(term));
	}, [positions, search]);
	const stats = statsResponse?.data;
	const totalEmployees =
		stats?.data?.reduce((sum: number, item: PositionStatistic) => sum + item.totalEmployees, 0) ?? 0;
	const employeeCountByPosition = useMemo(
		() => new Map((stats?.data ?? []).map((item) => [item.name.toLowerCase().trim(), item.totalEmployees])),
		[stats],
	);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<PositionFormValues>({
		defaultValues: { name: "" },
	});

	function handleClose() {
		reset();
		close();
	}

	useEffect(() => {
		if (editData) {
			reset({ name: editData.name });
		} else {
			reset({ name: "" });
		}
	}, [editData, reset]);

	const onSubmit = (values: PositionFormValues) => {
		if (isEdit && editData) {
			updatePosition(
				{ id: editData.id, data: { name: values.name } },
				{
					onSuccess: () => {
						handleClose();
						refetch();
					},
				},
			);
			return;
		}

		createPosition(values.name, {
			onSuccess: () => {
				handleClose();
				refetch();
			},
		});
	};

	return (
		<div className="flex flex-col gap-4">
			{stats && (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<Card className="py-0">
						<CardContent className="flex items-center gap-4 px-5 py-4">
							<div className="flex items-center justify-center size-10 rounded-full bg-blue-50">
								<Briefcase className="size-5 text-blue-600" />
							</div>
							<div className="flex flex-col gap-0.5">
								<span className="text-[12px] text-muted-foreground">Jami lavozimlar</span>
								<span className="text-[20px] font-bold leading-tight">{positions.length}</span>
							</div>
						</CardContent>
					</Card>
					<Card className="py-0">
						<CardContent className="flex items-center gap-4 px-5 py-4">
							<div className="flex items-center justify-center size-10 rounded-full bg-blue-50">
								<Users className="size-5 text-blue-600" />
							</div>
							<div className="flex flex-col gap-0.5">
								<span className="text-[12px] text-muted-foreground">Jami xodimlar</span>
								<span className="text-[20px] font-bold leading-tight">{totalEmployees}</span>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			<TableToolbar
				countLabel="Lavozimlar soni"
				count={visiblePositions.length}
				searchValue={search}
				onSearchChange={setSearch}
				onAdd={() => open()}
				addLabel="Lavozim qo'shish"
			/>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{visiblePositions.length ? (
					visiblePositions.map((position) => (
						<Card key={position.id} className="py-0">
							<CardContent className="flex flex-col gap-4 px-5 py-5">
								<div className="flex flex-col gap-0.5">
									<span className="text-[15px] font-semibold leading-tight">{position.name}</span>
									<span className="text-[12px] text-muted-foreground">
										{employeeCountByPosition.get(position.name.toLowerCase().trim()) ?? 0} ta xodim
									</span>
								</div>
								<div className="flex justify-center items-center gap-2">
									<button
										type="button"
										onClick={() => open(position)}
										className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[12px] font-semibold px-2 py-1 rounded-md transition-colors cursor-pointer"
									>
										<Pencil className="size-3" />
										Tahrirlash
									</button>
									<ConfirmPopover onConfirm={() => deletePosition(position.id)}>
										<button
											type="button"
											className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 hover:bg-red-100 text-[12px] font-semibold px-2 py-1 rounded-md transition-colors cursor-pointer"
										>
											<Trash2 className="size-3" />
											O'chirish
										</button>
									</ConfirmPopover>
								</div>
							</CardContent>
						</Card>
					))
				) : (
					<p className="col-span-full text-center text-muted-foreground py-10 text-[14px]">Ma'lumot topilmadi.</p>
				)}
			</div>
			<Modal open={isOpen} onClose={handleClose} title={isEdit ? "Lavozimni tahrirlash" : "Lavozim qo'shish"}>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 py-2">
					<div className="flex flex-col gap-2">
						<Label htmlFor="position-name">Lavozim nomi</Label>
						<Input
							id="position-name"
							placeholder="Masalan: Professor"
							{...register("name", { required: "Lavozim nomi kiritilishi shart" })}
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
