import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MaslahatService } from "@/features/consultation/consultation.service";
import type { ConsultationRequest, GetbyIdResponse } from "@/features/consultation/consultation.type";

interface EditConsultationInput extends ConsultationRequest {
	id: number;
}

export function useEditMaslahat() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: EditConsultationInput) => {
			const { id, ...data } = input;
			return MaslahatService.edit(id, data);
		},
		onSuccess: async (_data, variables) => {
			queryClient.setQueryData<GetbyIdResponse>(["maslahat", variables.userId], (old) => {
				if (!old?.data) return old;

				const currentBody = Array.isArray(old.data.body) ? old.data.body : old.data.body ? [old.data.body] : [];

				return {
					...old,
					data: {
						...old.data,
						body: currentBody.map((item) => (item.id === variables.id ? { ...item, ...variables } : item)),
					},
				};
			});

			await queryClient.invalidateQueries({ queryKey: ["maslahat", variables.userId] });
			await queryClient.invalidateQueries({ queryKey: ["teacher-stats", variables.userId] });
			await queryClient.invalidateQueries({ queryKey: ["teacher-completion", variables.userId] });
			await queryClient.refetchQueries({ queryKey: ["maslahat", variables.userId], type: "active" });
			await queryClient.refetchQueries({ queryKey: ["teacher-stats", variables.userId], type: "active" });
			await queryClient.refetchQueries({ queryKey: ["teacher-completion", variables.userId], type: "active" });
			toast.success("Maslahat muvaffaqiyatli tahrirlandi");
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Maslahatni tahrirlashda xatolik yuz berdi");
		},
	});
}
