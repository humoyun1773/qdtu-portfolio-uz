import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AwardRequest } from "@/features/mukofot/mukofot";
import { MukofotService } from "@/features/mukofot/mukofot.service";

export function useCreateMukofot() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: AwardRequest) => MukofotService.create(input),
		onSuccess: async (_data, variables) => {
			await queryClient.invalidateQueries({ queryKey: ["mukofot", variables.userId] });
			await queryClient.invalidateQueries({ queryKey: ["teacher-stats", variables.userId] });
			await queryClient.invalidateQueries({ queryKey: ["teacher-completion", variables.userId] });
			await queryClient.refetchQueries({ queryKey: ["mukofot", variables.userId], type: "active" });
			await queryClient.refetchQueries({ queryKey: ["teacher-stats", variables.userId], type: "active" });
			await queryClient.refetchQueries({ queryKey: ["teacher-completion", variables.userId], type: "active" });
			toast.success("Mukofot muvaffaqiyatli qo'shildi");
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Mukofot qo'shishda xatolik");
		},
	});
}
