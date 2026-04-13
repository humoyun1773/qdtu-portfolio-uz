import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fileService } from "@/features/file/file.service";
import { TeacherService } from "@/features/teacher/teacher.service";
import type { CreateTeacherParams } from "@/features/teacher/teacher.type";

interface CreateTeacherInput {
	fullName: string;
	phoneNumber: string;
	imgUrl?: File | null;
	lavozmId: number;
	gender: boolean;
	password: string;
	departmentId: number;
}

export function useCreateTeacher() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: CreateTeacherInput) => {
			const imgUrl = input.imgUrl ? await fileService.uploadImage(input.imgUrl) : null;

			const payload: CreateTeacherParams = {
				fullName: input.fullName,
				phoneNumber: input.phoneNumber,
				imgUrl,
				lavozmId: input.lavozmId,
				gender: input.gender,
				password: input.password,
				departmentId: input.departmentId,
			};

			return TeacherService.create(payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["teachers"] });
			toast.success("O'qituvchi muvaffaqiyatli qo'shildi");
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "O'qituvchini qo'shishda xatolik");
		},
	});
}
