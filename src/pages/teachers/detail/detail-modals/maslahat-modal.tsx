import { AlignLeft, Calendar, CheckCircle2, ClipboardList, FileUp, Pencil, Plus, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FileInput } from "@/components/file-input/file-input";
import { Modal } from "@/components/modal/modal";
import { fileService } from "@/features/file/file.service";
import { useCreateMaslahat } from "@/hooks/teacher/useCreateMahlahat";
import { useEditMaslahat } from "@/hooks/teacher/useEditMaslahat";
import { useModalActions, useModalEditData, useModalIsOpen } from "@/store/modalStore";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Textarea } from "@/ui/textarea";

type MaslahatFormData = {
	name: string;
	description: string;
	year: string;
	member?: boolean;
	finishedEnum?: "COMPLETED" | "IN_PROGRESS" | "FINISHED";
	leader: string;
	pdf: File | null;
};

function uploadResponseToUrl(raw: unknown): string {
	if (typeof raw === "string" && raw.trim() !== "") return raw;
	if (raw && typeof raw === "object") {
		const obj = raw as Record<string, unknown>;
		if (typeof obj.url === "string" && obj.url.trim() !== "") return obj.url;
		if (typeof obj.data === "string" && obj.data.trim() !== "") return obj.data;
	}
	return "";
}

export function MaslahatModal({ userId }: { userId: number }) {
	const isOpen = useModalIsOpen();
	const editData = useModalEditData();
	const { close } = useModalActions();
	const { mutateAsync: createMaslahat, isPending: isCreating } = useCreateMaslahat();
	const { mutateAsync: editMaslahat, isPending: isEditing } = useEditMaslahat();

	const visible = isOpen && editData?._type === "maslahat";
	const isEdit = visible && !!editData?.id;
	const isPending = isCreating || isEditing;
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { register, handleSubmit, control, reset } = useForm<MaslahatFormData>();

	useEffect(() => {
		if (visible) {
			reset(
				isEdit
					? {
							name: editData.name,
							description: editData.description,
							year: String(editData.year),
							member: editData.member,
							finishedEnum: editData.finishedEnum,
							leader: editData.leader,
							pdf: null,
						}
					: { name: "", description: "", year: "", member: undefined, finishedEnum: undefined, leader: "", pdf: null },
			);
		}
	}, [visible, isEdit, editData, reset]);

	const onSubmit = async (data: MaslahatFormData) => {
		if (data.member === undefined || !data.finishedEnum) {
			toast.error("A'zolik va holatini tanlang");
			return;
		}

		const yearNum = Number(data.year);
		if (!Number.isFinite(yearNum)) {
			toast.error("Yilni to'g'ri kiriting");
			return;
		}

		try {
			setIsSubmitting(true);
			let fileUrl = typeof editData?.fileUrl === "string" ? editData.fileUrl : "";
			if (data.pdf instanceof File) {
				const uploaded = await fileService.uploadPdf(data.pdf);
				fileUrl = uploadResponseToUrl(uploaded);
			}

			const payload = {
				name: data.name,
				description: data.description,
				year: yearNum,
				member: data.member,
				finishedEnum: data.finishedEnum,
				leader: data.leader,
				fileUrl,
				userId,
			};

			isEdit ? await editMaslahat({ id: editData.id, ...payload }) : await createMaslahat(payload);
			close();
		} catch {
			/* xato toast hookda */
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Modal
			open={visible}
			onClose={close}
			title={
				<div className="flex items-center gap-2">
					{isEdit ? <Pencil className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-green-500" />}
					<span>{isEdit ? "Maslahatni tahrirlash" : "Yangi maslahat qo'shish"}</span>
				</div>
			}
		>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-5 py-2 max-h-[75vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300"
			>
				<div className="space-y-4 p-4 rounded-xl bg-muted/30 border border-border/50">
					<div className="grid gap-2">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<ClipboardList className="w-4 h-4 text-muted-foreground" />
							Maslahat nomi
						</Label>
						<Input
							placeholder="Nomini kiriting..."
							{...register("name", { required: true })}
							className="bg-background"
						/>
					</div>
					<div className="grid gap-2">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<AlignLeft className="w-4 h-4 text-muted-foreground" />
							Tavsif
						</Label>
						<Textarea
							placeholder="Qisqacha tavsif..."
							className="min-h-[80px] resize-none bg-background"
							{...register("description")}
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="grid gap-2">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<Calendar className="w-4 h-4 text-muted-foreground" />
							Yil
						</Label>
						<Input type="number" placeholder="2024" {...register("year")} className="bg-background" />
					</div>
					<div className="grid gap-2">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<User className="w-4 h-4 text-muted-foreground" />
							Rahbar
						</Label>
						<Input placeholder="F.I.Sh..." {...register("leader")} className="bg-background" />
					</div>
					<div className="grid gap-2">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<Users className="w-4 h-4 text-muted-foreground" />
							A'zolik
						</Label>
						<Controller
							name="member"
							control={control}
							rules={{ required: true }}
							render={({ field }) => (
								<Select
									value={field.value === undefined ? undefined : String(field.value)}
									onValueChange={(val) => field.onChange(val === "true")}
								>
									<SelectTrigger className="bg-background">
										<SelectValue placeholder="Tanlang" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="true">Ha, a'zo</SelectItem>
										<SelectItem value="false">Yo'q, a'zo emas</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>
					<div className="grid gap-2">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<CheckCircle2 className="w-4 h-4 text-muted-foreground" />
							Holati
						</Label>
						<Controller
							name="finishedEnum"
							control={control}
							rules={{ required: true }}
							render={({ field }) => (
								<Select value={field.value ? String(field.value) : undefined} onValueChange={field.onChange}>
									<SelectTrigger className="bg-background">
										<SelectValue placeholder="Tanlang" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="COMPLETED">Tugallangan</SelectItem>
										<SelectItem value="IN_PROGRESS">Jarayonda</SelectItem>
										<SelectItem value="FINISHED">Yakunlangan</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>
				</div>

				<div className="grid gap-2 p-4 rounded-xl border-2 border-dashed border-muted-foreground/20">
					<Label className="flex items-center gap-2 text-sm font-medium">
						<FileUp className="w-4 h-4 text-primary" />
						Hujjat (PDF)
					</Label>
					<Controller
						name="pdf"
						control={control}
						render={({ field }) => (
							<FileInput type="document" accept=".pdf" value={field.value} onChange={field.onChange} />
						)}
					/>
				</div>

				<div className="flex items-center justify-end gap-3 pt-4 border-t">
					<Button type="button" variant="ghost" onClick={close}>
						Bekor qilish
					</Button>
					<Button type="submit" disabled={isPending || isSubmitting}>
						{isPending || isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
