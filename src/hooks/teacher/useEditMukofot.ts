import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AwardRequest } from "@/features/mukofot/mukofot";
import { MukofotService } from "@/features/mukofot/mukofot.service";

export interface EditMukofotInput extends AwardRequest {
	id: number;
}

export function useEditMukofot() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: EditMukofotInput) => {
			const { id, ...data } = input;
			return MukofotService.edit(id, data);
		},
		onSuccess: async (_data, variables) => {
			await queryClient.invalidateQueries({ queryKey: ["mukofot", variables.userId] });
			await queryClient.invalidateQueries({ queryKey: ["teacher-stats", variables.userId] });
			await queryClient.invalidateQueries({ queryKey: ["teacher-completion", variables.userId] });
			await queryClient.refetchQueries({ queryKey: ["mukofot", variables.userId], type: "active" });
			await queryClient.refetchQueries({ queryKey: ["teacher-stats", variables.userId], type: "active" });
			await queryClient.refetchQueries({ queryKey: ["teacher-completion", variables.userId], type: "active" });
			toast.success("Mukofot muvaffaqiyatli tahrirlandi");
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Mukofotni tahrirlashda xatolik yuz berdi");
		},
	});
}
