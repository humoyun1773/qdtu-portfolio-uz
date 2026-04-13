import { FileText, Save, User, CheckCircle, AlertCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FileInput } from "@/components/file-input/file-input";
import { SearchableSelect } from "@/components/searchable-select/searchable-select";
import type { ProfileFormData } from "@/features/teacher/teacher.type";
import { useDepartment } from "@/hooks/department/useDepartment";
import { usePosition } from "@/hooks/position/usePosition";
import { useUpdateProfile, type UpdateProfileMutationResult } from "@/hooks/teacher/useUpdateProfile";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Separator } from "@/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Textarea } from "@/ui/textarea";
import { cn } from "@/utils";

const PROFILE_SAVE_TOAST_ID = "teacher-profile-saved";

function profileDraftKey(teacherId: number) {
	return `teacher-profile-draft-${teacherId}`;
}

function profileFormToDraft(v: ProfileFormData): Record<string, unknown> {
	return {
		fullName: v.fullName,
		email: v.email,
		age: v.age,
		phoneNumber: v.phoneNumber,
		biography: v.biography,
		input: v.input,
		orcid: v.orcid,
		scopusid: v.scopusid,
		scienceId: v.scienceId,
		researcherId: v.researcherId,
		gender: v.gender,
		profession: v.profession,
		lavozmId: v.lavozmId,
		departmentId: v.departmentId,
		...(typeof v.imageUri === "string" ? { imageUri: v.imageUri } : {}),
		...(typeof v.fileUrl === "string" ? { fileUrl: v.fileUrl } : {}),
	};
}

type ProfileFormProps = {
	defaultValues: ProfileFormData;
	/** Serverdan kelgan ma'lumot o'zgaganda forma maydonlarini yangilash */
	formSyncKey?: string | number;
};

export function ProfileForm({ defaultValues, formSyncKey = 0 }: ProfileFormProps) {
	const { register, control, handleSubmit, reset, getValues, watch, formState } = useForm<ProfileFormData>({
		defaultValues,
	});
	const { isDirty } = formState;

	const defaultsRef = useRef(defaultValues);
	defaultsRef.current = defaultValues;

	const syncKeyRef = useRef(formSyncKey);
	syncKeyRef.current = formSyncKey;

	const lastAppliedSyncKeyRef = useRef<string | number | undefined>(undefined);
	const prevTeacherIdRef = useRef(defaultValues.id);

	useEffect(() => {
		const teacherId = defaultValues.id;
		if (teacherId !== prevTeacherIdRef.current) {
			prevTeacherIdRef.current = teacherId;
			lastAppliedSyncKeyRef.current = undefined;
			reset(defaultsRef.current);
			lastAppliedSyncKeyRef.current = formSyncKey;
			return;
		}

		if (formSyncKey === lastAppliedSyncKeyRef.current) return;
		if (isDirty) return;

		reset(defaultsRef.current);
		lastAppliedSyncKeyRef.current = formSyncKey;
	}, [defaultValues.id, formSyncKey, isDirty, reset]);

	useEffect(() => {
		try {
			const raw = sessionStorage.getItem(profileDraftKey(defaultValues.id));
			if (!raw) return;
			const patch = JSON.parse(raw) as Partial<ProfileFormData>;
			reset((prev) => ({ ...prev, ...patch }));
		} catch {
			/* ignore */
		}
	}, [formSyncKey, defaultValues.id, reset]);

	useEffect(() => {
		const key = profileDraftKey(defaultValues.id);
		let t: ReturnType<typeof setTimeout>;
		const sub = watch((values) => {
			clearTimeout(t);
			t = setTimeout(() => {
				try {
					sessionStorage.setItem(key, JSON.stringify(profileFormToDraft(values as ProfileFormData)));
				} catch {
					/* ignore */
				}
			}, 450);
		});
		return () => {
			clearTimeout(t);
			sub.unsubscribe();
		};
	}, [watch, defaultValues.id]);

	const tabStorageKey = `teacher-profile-tab-${defaultValues.id}`;
	const [activeTab, setActiveTab] = useState<"main" | "extra">("main");

	useEffect(() => {
		try {
			const s = sessionStorage.getItem(tabStorageKey);
			setActiveTab(s === "extra" || s === "main" ? s : "main");
		} catch {
			setActiveTab("main");
		}
	}, [tabStorageKey]);

	const onTabChange = useCallback(
		(value: string) => {
			const v = value === "extra" ? "extra" : "main";
			setActiveTab(v);
			try {
				sessionStorage.setItem(tabStorageKey, v);
			} catch {
				/* ignore */
			}
		},
		[tabStorageKey]
	);

	const { data: departmentResponse } = useDepartment();
	const { data: positionResponse } = usePosition();

	const departmentOptions = useMemo(
		() =>
			(departmentResponse?.data ?? []).map((department) => ({
				value: String(department.id),
				label: department.name,
			})),
		[departmentResponse]
	);

	const positionOptions = useMemo(
		() =>
			(positionResponse?.data ?? []).map((position) => ({
				value: String(position.id),
				label: position.name,
			})),
		[positionResponse]
	);

	const { mutate: updateProfile, isPending } = useUpdateProfile();
	const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
	const submitLockRef = useRef(false);

	const onSubmit = (data: ProfileFormData) => {
		if (isPending || submitLockRef.current) return;
		submitLockRef.current = true;

		updateProfile(data, {
			onSuccess: (result: UpdateProfileMutationResult) => {
				try {
					sessionStorage.removeItem(profileDraftKey(data.id));
				} catch {
					/* ignore */
				}
				toast.success("Ma'lumot saqlandi", { id: PROFILE_SAVE_TOAST_ID });
				const v = getValues();
				reset({
					...v,
					imageUri: result.nextImageUrl ?? (typeof v.imageUri === "string" ? v.imageUri : null),
					fileUrl: result.nextFileUrl ?? (typeof v.fileUrl === "string" ? v.fileUrl : null),
				});
				lastAppliedSyncKeyRef.current = String(syncKeyRef.current);
				setSaveStatus("success");
				setTimeout(() => setSaveStatus("idle"), 2000);
			},
			onError: () => {
				setSaveStatus("error");
				setTimeout(() => setSaveStatus("idle"), 3000);
			},
			onSettled: () => {
				submitLockRef.current = false;
			},
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
			{/* Header */}
			<div className="flex items-center justify-between gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800">
				<div>
					<h1 className="text-base font-semibold text-gray-900 dark:text-white">
						Profil ma'lumotlari
					</h1>
					<p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
						Saqlash uchun tugmani bosing
					</p>
				</div>

				{/* Status Indicator */}
				<div className="flex items-center gap-2">
					{isPending && (
						<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/50">
							<div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent"></div>
							<span className="text-xs font-medium text-blue-700 dark:text-blue-200">
								Saqlanmoqda...
							</span>
						</div>
					)}

					{saveStatus === "success" && !isPending && (
						<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/50 animate-in fade-in duration-300">
							<CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
							<span className="text-xs font-medium text-green-700 dark:text-green-200">
								Saqlandi
							</span>
						</div>
					)}

					{saveStatus === "error" && !isPending && (
						<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-900/50 animate-in fade-in duration-300">
							<AlertCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
							<span className="text-xs font-medium text-red-700 dark:text-red-200">
								Xatolik
							</span>
						</div>
					)}

					<Button
						type="submit"
						size="sm"
						disabled={isPending}
						className="gap-1.5 shrink-0 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-all duration-200"
					>
						<Save className="size-4" />
						<span className="hidden sm:inline">Saqlash</span>
					</Button>
				</div>
			</div>

			{/* Tabs */}
			<div className="rounded-xl border bg-card overflow-hidden shadow-sm">
				<Tabs value={activeTab} onValueChange={onTabChange}>
					<div className="border-b px-2 sm:px-4 overflow-x-auto bg-muted/30">
						<TabsList className="bg-transparent h-auto p-0 rounded-none gap-0 justify-start min-w-max">
							{[
								{
									value: "main",
									label: "Asosiy ma'lumotlar",
									icon: <User className="size-3.5" />,
								},
								{
									value: "extra",
									label: "Qo'shimcha ma'lumotlar",
									icon: <FileText className="size-3.5" />,
								},
							].map((tab) => (
								<TabsTrigger
									key={tab.value}
									value={tab.value}
									className={cn(
										"rounded-none border-0 border-b-2 border-transparent px-3 sm:px-4 py-3 text-[12px] sm:text-[13px] gap-1.5 h-auto whitespace-nowrap transition-all duration-200",
										"data-[state=active]:border-blue-600 data-[state=active]:bg-transparent dark:data-[state=active]:bg-transparent",
										"data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-none",
										"hover:text-blue-500 dark:hover:text-blue-300"
									)}
								>
									{tab.icon}
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>
					</div>

					{/* Asosiy ma'lumotlar */}
					<TabsContent value="main" className="p-4 sm:p-5 mt-0">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<FormField
								label="To'liq ism"
								id="fullName"
								placeholder="Masalan: Aliyev Bobur Hamidovich"
								register={register("fullName")}
							/>

							<FormField
								label="Email"
								id="email"
								type="email"
								placeholder="example@ttu.uz"
								register={register("email")}
							/>

							<FormField
								label="Yosh"
								id="age"
								type="number"
								placeholder="45"
								register={register("age", { valueAsNumber: true })}
							/>

							<FormField
								label="Telefon raqami"
								id="phoneNumber"
								placeholder="+998 (90) 000-00-00"
								register={register("phoneNumber")}
							/>

							<FormField
								label="Mutaxassisligi"
								id="profession"
								placeholder="Masalan: Jarrohlik..."
								register={register("profession")}
							/>

							<SelectField
								label="Lavozim"
								name="lavozmId"
								control={control}
								options={positionOptions}
							/>

							<SelectField
								label="Kafedra"
								name="departmentId"
								control={control}
								options={departmentOptions}
							/>

							<div className="col-span-1 sm:col-span-2">
								<Separator className="my-2" />
							</div>

							<FormField
								label="ORC ID"
								id="orcid"
								placeholder="0000-0000-0000-0000"
								register={register("orcid")}
							/>

							<FormField
								label="Scopus ID"
								id="scopusid"
								placeholder="Masalan: 57210000000"
								register={register("scopusid")}
							/>

							<FormField
								label="Science ID"
								id="scienceId"
								placeholder="Masalan: A-1234-2020"
								register={register("scienceId")}
							/>

							<FormField
								label="Researcher ID"
								id="researcherId"
								placeholder="Masalan: A-1234-2020"
								register={register("researcherId")}
							/>
						</div>
					</TabsContent>

					{/* Qo'shimcha ma'lumotlar */}
					<TabsContent value="extra" className="p-4 sm:p-5 mt-0 flex flex-col gap-4">
						<TextareaField
							label="Biografiya"
							id="biography"
							placeholder="Qisqacha biografiya..."
							register={register("biography")}
						/>

						<TextareaField
							label="Qo'shimcha ma'lumot"
							id="input"
							placeholder="Ilmiy yutuqlar, tajriba..."
							register={register("input")}
						/>

						<Separator />

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<FileField
								label="Rasmi"
								name="imageUri"
								control={control}
								type="image"
							/>

							<FileField
								label="Rezyume (PDF/DOCX)"
								name="fileUrl"
								control={control}
								type="document"
								accept=".pdf,.doc,.docx"
							/>
						</div>
					</TabsContent>
				</Tabs>
			</div>

			<Separator />
		</form>
	);
}

// ============================================================================
// Helper Components
// ============================================================================

function FormField({
	label,
	id,
	type = "text",
	placeholder,
	register,
}: {
	label: string;
	id: string;
	type?: string;
	placeholder?: string;
	register: any;
}) {
	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
				{label}
			</Label>
			<Input
				id={id}
				type={type}
				placeholder={placeholder}
				{...register}
				className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
			/>
		</div>
	);
}

function TextareaField({
	label,
	id,
	placeholder,
	register,
}: {
	label: string;
	id: string;
	placeholder?: string;
	register: any;
}) {
	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
				{label}
			</Label>
			<Textarea
				id={id}
				placeholder={placeholder}
				className="min-h-20 resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
				{...register}
			/>
		</div>
	);
}

function SelectField({
	label,
	name,
	control,
	options,
}: {
	label: string;
	name: keyof ProfileFormData;
	control: any;
	options: { value: string; label: string }[];
}) {
	return (
		<div className="flex flex-col gap-2">
			<Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
				{label}
			</Label>
			<Controller
				name={name}
				control={control}
				render={({ field }) => (
					<SearchableSelect
						options={options}
						value={field.value?.toString()}
						onChange={(value) => field.onChange(Number(value))}
						placeholder={`${label}ni tanlang`}
						searchPlaceholder={`${label} qidirish...`}
					/>
				)}
			/>
		</div>
	);
}

function FileField({
	label,
	name,
	control,
	type,
	accept,
}: {
	label: string;
	name: keyof ProfileFormData;
	control: any;
	type: "image" | "document";
	accept?: string;
}) {
	return (
		<div className="flex flex-col gap-2">
			<Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
				{label}
			</Label>
			<Controller
				name={name}
				control={control}
				render={({ field }) => (
					<FileInput
						type={type}
						value={field.value ?? null}
						onChange={field.onChange}
						accept={accept}
					/>
				)}
			/>
		</div>
	);
}