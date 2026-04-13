import { Briefcase, Pencil, Trash2, Users, Plus, Search, X } from "lucide-react";
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
		if (editData) reset({ name: editData.name });
		else reset({ name: "" });
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
		<div className="flex flex-col gap-6 animate-in fade-in duration-500">
			{/* Stats Section */}
			{stats && (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-950">
						<CardContent className="flex items-center gap-4 px-6 py-5">
							<div className="flex items-center justify-center size-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 shadow-inner">
								<Briefcase className="size-6" />
							</div>
							<div className="flex flex-col">
								<span className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
									Jami lavozimlar
								</span>
								<span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
									{positions.length}
								</span>
							</div>
						</CardContent>
					</Card>
					<Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-950">
						<CardContent className="flex items-center gap-4 px-6 py-5">
							<div className="flex items-center justify-center size-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 shadow-inner">
								<Users className="size-6" />
							</div>
							<div className="flex flex-col">
								<span className="text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
									Jami xodimlar
								</span>
								<span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
									{totalEmployees}
								</span>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Toolbar Section */}
			<div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm">
				<TableToolbar
					countLabel="Topilgan lavozimlar"
					count={visiblePositions.length}
					searchValue={search}
					onSearchChange={setSearch}
					onAdd={() => open()}
					addLabel="Lavozim qo'shish"
				/>
			</div>

			{/* Grid Content */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{visiblePositions.length ? (
					visiblePositions.map((position) => {
						const count = employeeCountByPosition.get(position.name.toLowerCase().trim()) ?? 0;
						return (
							<Card
								key={position.id}
								className="group border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-md transition-all duration-300 bg-white dark:bg-slate-950 rounded-2xl overflow-hidden"
							>
								<CardContent className="flex flex-col gap-5 px-5 py-5">
									<div className="flex flex-col gap-1">
										<h3 className="text-[16px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors truncate">
											{position.name}
										</h3>
										<div className="flex items-center gap-1.5 text-slate-500">
											<Users className="size-3.5" />
											<span className="text-[13px] font-medium">{count} ta xodim biriktirilgan</span>
										</div>
									</div>

									<div className="flex items-center gap-2 pt-2 border-t border-slate-50 dark:border-slate-900">
										<button
											type="button"
											onClick={() => open(position)}
											className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-700 text-[12px] font-bold py-2 rounded-xl transition-all active:scale-95"
										>
											<Pencil className="size-3.5" />
											Tahrirlash
										</button>
										<ConfirmPopover onConfirm={() => deletePosition(position.id)}>
											<button
												type="button"
												className="inline-flex items-center justify-center size-9 bg-rose-50 dark:bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all active:scale-95"
											>
												<Trash2 className="size-4" />
											</button>
										</ConfirmPopover>
									</div>
								</CardContent>
							</Card>
						);
					})
				) : (
					<div className="col-span-full bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl py-16 flex flex-col items-center justify-center gap-3 text-center">
						<div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
							<Search className="size-6" />
						</div>
						<p className="text-slate-500 font-medium italic">Qidiruv bo'yicha hech qanday lavozim topilmadi.</p>
					</div>
				)}
			</div>

			{/* Modal Section */}
			<Modal open={isOpen} onClose={handleClose} title={isEdit ? "Lavozimni yangilash" : "Yangi lavozim qo'shish"}>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 py-4">
					<div className="flex flex-col gap-3">
						<Label
							htmlFor="position-name"
							className="text-[13px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest ml-1"
						>
							Lavozim nomi
						</Label>
						<Input
							id="position-name"
							className="h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-base"
							placeholder="Masalan: Professor, Dotsent"
							{...register("name", { required: "Lavozim nomi kiritilishi shart" })}
						/>
						{errors.name && (
							<span className="text-[12px] text-rose-500 font-semibold ml-1 flex items-center gap-1">
								<X className="size-3" /> {errors.name.message}
							</span>
						)}
					</div>

					<div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-900">
						<Button
							type="button"
							variant="ghost"
							onClick={handleClose}
							disabled={isPending}
							className="rounded-xl font-bold"
						>
							Bekor qilish
						</Button>
						<Button
							type="submit"
							disabled={isPending}
							className="rounded-xl bg-blue-600 hover:bg-blue-700 px-8 font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
						>
							{isPending ? "Saqlanmoqda..." : isEdit ? "O'zgarishlarni saqlash" : "Qo'shish"}
						</Button>
					</div>
				</form>
			</Modal>
		</div>
	);
}
