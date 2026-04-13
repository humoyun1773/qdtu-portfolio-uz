import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PositionService } from "@/features/position/position.service";

export function useCreatePosition() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (name: string) => PositionService.create({ name }),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["positions"] });
			queryClient.invalidateQueries({ queryKey: ["positions-stats"] });
			toast.success("Lavozim muvaffaqiyatli qo'shildi");
		},

		onError: (error: { message: string }) => {
			toast.error(error.message || "Lavozim qo'shishda xatolik");
		},
	});
}
