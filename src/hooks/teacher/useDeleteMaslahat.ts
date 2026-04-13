import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MaslahatService } from "@/features/consultation/consultation.service";

export function useDeleteMaslahat() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => MaslahatService.delete(id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["maslahat"] });
			await queryClient.refetchQueries({ queryKey: ["maslahat"], type: "active" });
			toast.success("Maslahat muvaffaqiyatli o'chirildi");
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Maslahatni o'chirishda xatolik");
		},
	});
}
