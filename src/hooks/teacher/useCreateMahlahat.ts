import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MaslahatService } from "@/features/consultation/consultation.service";
import type { ConsultationRequest, GetbyIdResponse } from "@/features/consultation/consultation.type";

export function useCreateMaslahat() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: ConsultationRequest) => MaslahatService.create(input),
		onSuccess: async (_data, variables) => {
			queryClient.setQueryData<GetbyIdResponse>(["maslahat", variables.userId], (old) => {
				if (!old?.data) return old;

				const currentBody = Array.isArray(old.data.body) ? old.data.body : old.data.body ? [old.data.body] : [];
				const nextItem = {
					id: Date.now(),
					...variables,
				};

				return {
					...old,
					data: {
						...old.data,
						totalElements: (old.data.totalElements ?? currentBody.length) + 1,
						body: [nextItem, ...currentBody],
					},
				};
			});

			await queryClient.invalidateQueries({ queryKey: ["maslahat", variables.userId] });
			await queryClient.invalidateQueries({ queryKey: ["teacher-stats", variables.userId] });
			await queryClient.invalidateQueries({ queryKey: ["teacher-completion", variables.userId] });
			await queryClient.refetchQueries({ queryKey: ["maslahat", variables.userId], type: "active" });
			await queryClient.refetchQueries({ queryKey: ["teacher-stats", variables.userId], type: "active" });
			await queryClient.refetchQueries({ queryKey: ["teacher-completion", variables.userId], type: "active" });
			toast.success("Maslahat muvaffaqiyatli qo'shildi");
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Maslahat qo'shishda xatolik");
		},
	});
}
