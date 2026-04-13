import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { publicationService } from "@/features/publication/publication.service";
import type { PublicationCreateParams } from "@/features/publication/publication.type";

export function useCreateNashr() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: PublicationCreateParams) => publicationService.create(input),
		onSuccess: async (_data, variables) => {
			await queryClient.invalidateQueries({ queryKey: ["nashr", variables.userId] });
			await queryClient.invalidateQueries({ queryKey: ["teacher-stats", variables.userId] });
			await queryClient.invalidateQueries({ queryKey: ["teacher-completion", variables.userId] });
			await queryClient.refetchQueries({ queryKey: ["nashr", variables.userId], type: "active" });
			await queryClient.refetchQueries({ queryKey: ["teacher-stats", variables.userId], type: "active" });
			await queryClient.refetchQueries({ queryKey: ["teacher-completion", variables.userId], type: "active" });
			toast.success("Nashr muvaffaqiyatli qo'shildi");
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Nashr qo'shishda xatolik");
		},
	});
}
