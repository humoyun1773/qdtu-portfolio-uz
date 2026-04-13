import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { NazoratService } from "@/features/nazorat/nazorat.service";
import type { NazoratCreateDTO } from "@/features/nazorat/nazorat.type";

export function useCreateNazorat() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: NazoratCreateDTO) => NazoratService.create(input),
		onSuccess: async (_data, variables) => {
			await queryClient.invalidateQueries({ queryKey: ["nazorat", variables.userId] });
			await queryClient.invalidateQueries({ queryKey: ["teacher-stats", variables.userId] });
			await queryClient.invalidateQueries({ queryKey: ["teacher-completion", variables.userId] });
			await queryClient.refetchQueries({ queryKey: ["nazorat", variables.userId], type: "active" });
			await queryClient.refetchQueries({ queryKey: ["teacher-stats", variables.userId], type: "active" });
			await queryClient.refetchQueries({ queryKey: ["teacher-completion", variables.userId], type: "active" });
			toast.success("Nazorat muvaffaqiyatli qo'shildi");
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Nazorat qo'shishda xatolik");
		},
	});
}
