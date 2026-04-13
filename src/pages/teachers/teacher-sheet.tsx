import { FileInput } from "@/components/file-input/file-input";
import { SearchableSelect } from "@/components/searchable-select/searchable-select";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { ScrollArea } from "@/ui/scroll-area";
import { Separator } from "@/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { CreateTeacherParams, EditTeacherParams } from "@/features/teacher/teacher.type";
import { useTeacherSheetActions, useTeacherSheetEditData, useTeacherSheetIsOpen } from "@/store/teacherSheet";
import { useCreateTeacher } from "@/hooks/teacher/useCreateTeacher";
import { useDepartment } from "@/hooks/department/useDepartment";
import { usePosition } from "@/hooks/position/usePosition";
import { useEditTeacher } from "@/hooks/teacher/useEditTeacher";
import { useCollage } from "@/hooks/collage/useCollage";

interface TeacherFormValues {
	fullName: string;
	phoneNumber: string;
	email: string;
	gender: boolean;
	collegeId: string;
	departmentId: string;
	positionId: string;
	imgUrl: File | null;
	password: string;
	confirmPassword: string;
}

interface TeacherEditValues {
  id: number;
  fullName: string;
  phoneNumber: string;
  imgUrl: File ;
  fileUrl: string;
  lavozmId: number;
  gender: boolean;
  password: string;
  departmentId: number;
}

function formatPhone(digits: string): string {
	const d = digits.slice(0, 9);
	if (d.length === 0) return "+998";
	let result = "+998 (";
	result += d.slice(0, Math.min(2, d.length));
	if (d.length < 2) return result;
	result += ") ";
	result += d.slice(2, Math.min(5, d.length));
	if (d.length <= 5) return result;
	result += "-";
	result += d.slice(5, Math.min(7, d.length));
	if (d.length <= 7) return result;
	result += "-";
	result += d.slice(7, 9);
	return result;
}

function extractDigits(formatted: string): string {
	const all = formatted.replace(/\D/g, "");
	return all.startsWith("998") ? all.slice(3) : all;
}

export function TeacherSheet() {
	const isOpen = useTeacherSheetIsOpen();
	const editData = useTeacherSheetEditData();
	const { close } = useTeacherSheetActions();
	const isEdit = editData !== null;

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const { data: collegeResponse } = useCollage();
	const { data: departmentResponse } = useDepartment();
	const { data: positionResponse } = usePosition();

	const { mutate: createTeacher, isPending: isCreatePending } = useCreateTeacher();
	const { mutate: editTeacher, isPending: isEditPending } = useEditTeacher();
	const isSubmitPending = isCreatePending || isEditPending;

	const COLLEGES = useMemo(
		() =>
			(collegeResponse?.data ?? []).map((c) => ({
				value: String(c.id),
				label: c.name,
			})),
		[collegeResponse],
	);

	const POSITIONS = useMemo(
		() =>
			(positionResponse?.data ?? []).map((p: { id: number; name: string }) => ({
				value: String(p.id),
				label: p.name,
			})),
		[positionResponse],
	);

	const DEPARTMENTS = useMemo(
		() =>
			(departmentResponse?.data ?? []).map((d) => ({
				value: String(d.id),
				label: d.name,
				collegeId: String(d.collegeId),
			})),
		[departmentResponse],
	);

	const {
		register,
		handleSubmit,
		reset,
		control,
		watch,
		setValue,
		formState: { errors },
	} = useForm<TeacherFormValues>({
		defaultValues: {
			fullName: "",
			phoneNumber: "998",
			email: "",
			gender: true,
			collegeId: "",
			departmentId: "",
			positionId: "",
			imgUrl: null,
			password: "",
			confirmPassword: "",
		},
	});

	const watchedCollegeId = watch("collegeId");
	const watchedPassword = watch("password");

	useEffect(() => {
		if (editData) {
			const college = COLLEGES.find((c) => c.label === editData.faculty);
			const department = DEPARTMENTS.find((d) => d.label === editData.department);
			const position = POSITIONS.find((p) => p.label === editData.position);

			reset({
				fullName: editData.name,
				phoneNumber: editData.phoneNumber,
				email: editData.email ?? "",
				gender: editData.gender ?? true,
				collegeId: college?.value ?? "",
				departmentId: department?.value ?? "",
				positionId: position?.value ?? "",
				imgUrl: null,
				password: "",
				confirmPassword: "",
			});
		}
	}, [editData, reset, COLLEGES, DEPARTMENTS, POSITIONS]);

	const availableDepartments = useMemo(
		() => (watchedCollegeId ? DEPARTMENTS.filter((d) => d.collegeId === watchedCollegeId) : DEPARTMENTS),
		[watchedCollegeId, DEPARTMENTS],
	);

	const handleCollegeChange = (value: string) => {
		setValue("collegeId", value);
		setValue("departmentId", "");
	};

	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const digits = extractDigits(e.target.value);
		setValue("phoneNumber", formatPhone(digits), { shouldValidate: true });
	};

	const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, currentValue: string) => {
		if (e.key === "Backspace") {
			e.preventDefault();
			const digits = extractDigits(currentValue);
			setValue("phoneNumber", digits.length > 0 ? formatPhone(digits.slice(0, -1)) : "+998", { shouldValidate: true });
		}
	};

	const handleClose = () => {
		reset();
		setShowPassword(false);
		setShowConfirm(false);
		close();
	};

	const onSubmit = (values: TeacherFormValues) => {
    const phoneDigits = values.phoneNumber.replace(/\D/g, "");
    const phoneNumber = `${phoneDigits}`;

    if (isEdit && editData) {
        const editPayload: EditTeacherParams = {
            id: editData.id,
            fullName: values.fullName,
            phoneNumber: phoneNumber,
            gender: values.gender,
            imgUrl: values.imgUrl,
            lavozmId: Number(values.positionId),
            departmentId: Number(values.departmentId),
            password: values.password || editData.password,
        };

        editTeacher(editPayload, { onSuccess: handleClose });
        return;
    }

    const createPayload: CreateTeacherParams = {
        fullName: values.fullName,
        phoneNumber: phoneNumber,
        email: values.email,
        imgUrl: values.imgUrl,
        lavozmId: Number(values.positionId),
        gender: values.gender,
        password: values.password,
        departmentId: Number(values.departmentId),
    };

    createTeacher(createPayload, { onSuccess: handleClose });
};

	return (
		<Sheet open={isOpen} onOpenChange={(v) => !v && handleClose()}>
			<SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col gap-0">
				<SheetHeader className="px-6 py-4 border-b">
					<SheetTitle className="text-[16px]">{isEdit ? "O'qituvchini tahrirlash" : "O'qituvchi qo'shish"}</SheetTitle>
				</SheetHeader>

				<ScrollArea className="flex-1">
					<form id="teacher-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 px-6 py-5">
						{/* Rasm */}
						<div className="flex flex-col gap-2">
							<Label>
								Rasm <span className="text-muted-foreground font-normal">(ixtiyoriy)</span>
							</Label>
							<Controller
								name="imgUrl"
								control={control}
								render={({ field }) => <FileInput type="image" value={field.value} onChange={field.onChange} />}
							/>
						</div>

						<Separator />

						{/* To'liq F.I.Sh. */}
						<div className="flex flex-col gap-2">
							<Label htmlFor="fullName">To'liq F.I.Sh.</Label>
							<Input
								id="fullName"
								placeholder="Masalan: Aliyev Bobur Hamidovich"
								{...register("fullName", {
									required: "To'liq ism kiritilishi shart",
									minLength: { value: 5, message: "Kamida 5 ta belgi kiriting" },
								})}
							/>
							{errors.fullName && <span className="text-[12px] text-red-500">{errors.fullName.message}</span>}
						</div>

						{/* Email */}
						<div className="flex flex-col gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="example@domain.com"
								{...register("email", {
									required: "Email kiritilishi shart",
									pattern: {
										value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
										message: "Email noto'g'ri formatda",
									},
								})}
							/>
							{errors.email && <span className="text-[12px] text-red-500">{errors.email.message}</span>}
						</div>

						{/* Telefon */}
						<div className="flex flex-col gap-2">
							<Label htmlFor="phoneNumber">Telefon raqam</Label>
							<Controller
								name="phoneNumber"
								control={control}
								rules={{
									validate: (val) => val.replace(/\D/g, "").length === 12 || "To'liq telefon raqam kiriting",
								}}
								render={({ field }) => (
									<Input
										id="phoneNumber"
										inputMode="numeric"
										placeholder="+998 (90) 000-00-00"
										value={field.value}
										onChange={handlePhoneChange}
										onKeyDown={(e) => handlePhoneKeyDown(e, field.value)}
									/>
								)}
							/>
							{errors.phoneNumber && <span className="text-[12px] text-red-500">{errors.phoneNumber.message}</span>}
						</div>

						{/* Jinsi */}
						<div className="flex flex-col gap-2">
							<Label>Jinsi</Label>
							<Controller
								name="gender"
								control={control}
								rules={{ required: "Jinsi tanlanishi shart" }}
								render={({ field }) => (
									<SearchableSelect
										options={[
											{ value: "true", label: "Erkak" },
											{ value: "false", label: "Ayol" },
										]}
										value={String(field.value)}
										onChange={(val) => field.onChange(val ? true : false)}
										placeholder="Jinsni tanlang"
										searchPlaceholder="Qidirish..."
									/>
								)}
							/>
							{errors.gender && <span className="text-[12px] text-red-500">{errors.gender.message}</span>}
						</div>

						<Separator />

						{/* Kollej */}
						<div className="flex flex-col gap-2">
							<Label>Kollej</Label>
							<Controller
								name="collegeId"
								control={control}
								rules={{ required: "Kollej tanlanishi shart" }}
								render={({ field }) => (
									<SearchableSelect
										options={COLLEGES}
										value={field.value}
										onChange={handleCollegeChange}
										placeholder="Kollejni tanlang"
										searchPlaceholder="Kollej qidirish..."
									/>
								)}
							/>
							{errors.collegeId && <span className="text-[12px] text-red-500">{errors.collegeId.message}</span>}
						</div>

						{/* Kafedra */}
						<div className="flex flex-col gap-2">
							<Label>Kafedra</Label>
							<Controller
								name="departmentId"
								control={control}
								rules={{ required: "Kafedra tanlanishi shart" }}
								render={({ field }) => (
									<SearchableSelect
										options={availableDepartments}
										value={field.value}
										onChange={field.onChange}
										placeholder={watchedCollegeId ? "Kafedrani tanlang" : "Avval kollejni tanlang"}
										searchPlaceholder="Kafedra qidirish..."
									/>
								)}
							/>
							{errors.departmentId && <span className="text-[12px] text-red-500">{errors.departmentId.message}</span>}
						</div>

						{/* Lavozim */}
						<div className="flex flex-col gap-2">
							<Label>Lavozim</Label>
							<Controller
								name="positionId"
								control={control}
								rules={{ required: "Lavozim tanlanishi shart" }}
								render={({ field }) => (
									<SearchableSelect
										options={POSITIONS}
										value={field.value}
										onChange={field.onChange}
										placeholder="Lavozimni tanlang"
										searchPlaceholder="Lavozim qidirish..."
									/>
								)}
							/>
							{errors.positionId && <span className="text-[12px] text-red-500">{errors.positionId.message}</span>}
						</div>

						<Separator />

						{!isEdit && (
							<>
								{/* Parol */}
								<div className="flex flex-col gap-2">
									<Label htmlFor="password">Parol</Label>
									<div className="relative">
										<Input
											id="password"
											type={showPassword ? "text" : "password"}
											placeholder="Kamida 8 ta belgi"
											className="pr-10"
											{...register("password", {
												required: isEdit ? false : "Parol kiritilishi shart",
												minLength: {
													value: 8,
													message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak",
												},
											})}
										/>
										<button
											type="button"
											onClick={() => setShowPassword((v) => !v)}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
										>
											{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
										</button>
									</div>
									{errors.password && <span className="text-[12px] text-red-500">{errors.password.message}</span>}
								</div>

								{/* Parolni tasdiqlash */}
								<div className="flex flex-col gap-2">
									<Label htmlFor="confirmPassword">Parolni tasdiqlash</Label>
									<div className="relative">
										<Input
											id="confirmPassword"
											type={showConfirm ? "text" : "password"}
											placeholder="Parolni qayta kiriting"
											className="pr-10"
											{...register("confirmPassword", {
												required: isEdit ? false : "Parolni tasdiqlash shart",
												validate: (val) => val === watchedPassword || "Parollar mos kelmadi",
											})}
										/>
										<button
											type="button"
											onClick={() => setShowConfirm((v) => !v)}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
										>
											{showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
										</button>
									</div>
									{errors.confirmPassword && (
										<span className="text-[12px] text-red-500">{errors.confirmPassword.message}</span>
									)}
								</div>
							</>
						)}
					</form>
				</ScrollArea>

				<div className="border-t px-6 py-4 flex items-center justify-end gap-2 shrink-0">
					<Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitPending}>
						Bekor qilish
					</Button>
					<Button type="submit" form="teacher-form" disabled={isSubmitPending}>
						{isSubmitPending ? "Saqlanmoqda..." : "Saqlash"}
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
