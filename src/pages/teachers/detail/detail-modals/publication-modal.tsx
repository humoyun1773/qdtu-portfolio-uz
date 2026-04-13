import {
	AlignLeft,
	BarChart,
	Building2,
	Calendar,
	CheckCircle2,
	FileUp,
	Globe2,
	// Plus,
	Pencil,
	Search,
	User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FileInput } from "@/components/file-input/file-input";
import { Modal } from "@/components/modal/modal";
import { fileService } from "@/features/file/file.service";
import { useCreateNazorat } from "@/hooks/teacher/useCreateNazorat";
import { useEditNazorat } from "@/hooks/teacher/useEditNazorat";
import { useModalActions, useModalEditData, useModalIsOpen } from "@/store/modalStore";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Textarea } from "@/ui/textarea";

type NazoratFormData = {
	name: string;
	description: string;
	researcherName: string;
	univerName: string;
	year: string;
	level?: "YUQORI" | "O'RTA" | "BOSHLANG'ICH";
	memberEnum?: "MILLIY" | "XALQARO";
	finished?: "true" | "false";
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

export function PublicationModal({ userId }: { userId: number }) {
	const isOpen = useModalIsOpen();
	const editData = useModalEditData();
	const { close } = useModalActions();
	const { mutateAsync: createNazorat, isPending: isCreating } = useCreateNazorat();
	const { mutateAsync: editNazorat, isPending: isEditing } = useEditNazorat();

	const visible = isOpen && editData?._type === "nazorat";
	const isEdit = visible && !!editData?.id;
	const isPending = isCreating || isEditing;
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { register, handleSubmit, control, reset } = useForm<NazoratFormData>();

	useEffect(() => {
		if (visible) {
			reset(
				isEdit
					? {
							name: editData.name,
							description: editData.description,
							researcherName: editData.researcherName,
							univerName: editData.univerName,
							year: String(editData.year),
							level: editData.level,
							memberEnum: editData.memberEnum,
							finished: editData.finished ? "true" : "false",
							pdf: null,
						}
					: {
							name: "",
							description: "",
							researcherName: "",
							univerName: "",
							year: "",
							level: undefined,
							memberEnum: undefined,
							finished: undefined,
							pdf: null,
						},
			);
		}
	}, [visible, isEdit, editData, reset]);

	const onSubmit = async (data: NazoratFormData) => {
		if (!data.level || !data.memberEnum || data.finished === undefined) {
			toast.error("Daraja, a'zolik va holatni tanlang");
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
				researcherName: data.researcherName,
				univerName: data.univerName,
				level: data.level,
				memberEnum: data.memberEnum,
				year: yearNum,
				finished: data.finished === "true",
				fileUrl,
				userId,
			};

			isEdit ? await editNazorat({ id: editData.id, ...payload }) : await createNazorat(payload);
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
					{isEdit ? <Pencil className="w-5 h-5 text-blue-500" /> : <Search className="w-5 h-5 text-orange-500" />}
					<span>{isEdit ? "Nazoratni tahrirlash" : "Yangi nazorat qo'shish"}</span>
				</div>
			}
		>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-5 py-2 max-h-[75vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300"
			>
				<div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border/50">
					<div className="grid gap-1.5">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<Search className="w-4 h-4 text-muted-foreground" /> Nazorat nomi
						</Label>
						<Input placeholder="Nazorat nomi..." {...register("name", { required: true })} className="bg-background" />
					</div>
					<div className="grid gap-1.5">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<AlignLeft className="w-4 h-4 text-muted-foreground" /> Tavsif
						</Label>
						<Textarea
							placeholder="Qisqacha tavsif..."
							className="  min-height: 60px; resize-none bg-background"
							{...register("description")}
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="grid gap-1.5">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<User className="w-4 h-4 text-muted-foreground" /> Tadqiqotchi
						</Label>
						<Input placeholder="F.I.Sh..." {...register("researcherName")} className="bg-background" />
					</div>
					<div className="grid gap-1.5">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<Building2 className="w-4 h-4 text-muted-foreground" /> Universitet
						</Label>
						<Input placeholder="OTM nomi..." {...register("univerName")} className="bg-background" />
					</div>
					<div className="grid gap-1.5">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<Calendar className="w-4 h-4 text-muted-foreground" /> Yil
						</Label>
						<Input type="number" placeholder="2024" {...register("year")} className="bg-background" />
					</div>
					<div className="grid gap-1.5">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<BarChart className="w-4 h-4 text-muted-foreground" /> Daraja
						</Label>
						<Controller
							name="level"
							control={control}
							rules={{ required: true }}
							render={({ field }) => (
								<Select value={field.value ? String(field.value) : undefined} onValueChange={field.onChange}>
									<SelectTrigger className="bg-background">
										<SelectValue placeholder="Tanlang" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="YUQORI">Yuqori</SelectItem>
										<SelectItem value="O'RTA">O'rta</SelectItem>
										<SelectItem value="BOSHLANG'ICH">Boshlang'ich</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>
					<div className="grid gap-1.5">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<Globe2 className="w-4 h-4 text-muted-foreground" /> A'zolik
						</Label>
						<Controller
							name="memberEnum"
							control={control}
							rules={{ required: true }}
							render={({ field }) => (
								<Select value={field.value ? String(field.value) : undefined} onValueChange={field.onChange}>
									<SelectTrigger className="bg-background">
										<SelectValue placeholder="Tanlang" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="MILLIY">Milliy</SelectItem>
										<SelectItem value="XALQARO">Xalqaro</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>
					<div className="grid gap-1.5">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<CheckCircle2 className="w-4 h-4 text-muted-foreground" /> Holati
						</Label>
						<Controller
							name="finished"
							control={control}
							rules={{ required: true }}
							render={({ field }) => (
								<Select value={field.value ? String(field.value) : undefined} onValueChange={field.onChange}>
									<SelectTrigger className="bg-background">
										<SelectValue placeholder="Tanlang" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="false">Jarayonda</SelectItem>
										<SelectItem value="true">Tugallangan</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>
				</div>

				<div className="grid gap-2 p-4 rounded-xl border-2 border-dashed border-muted-foreground/20">
					<Label className="flex items-center gap-2 text-sm font-medium">
						<FileUp className="w-4 h-4 text-primary" /> Hujjat PDF
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
