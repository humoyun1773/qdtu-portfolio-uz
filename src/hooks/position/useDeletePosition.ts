import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PositionService } from "@/features/position/position.service";
import type { Position, PositionListResponse } from "@/features/position/position.type";

export function useDeletePosition() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => PositionService.delete(id),
		onSuccess: async (response, deletedId) => {
			const isExplicitFailure =
				response && typeof response === "object" && "success" in response && response.success === false;

			if (isExplicitFailure) {
				toast.error(response?.message || "Lavozimni o'chirishda xatolik");
				return;
			}

			queryClient.setQueriesData({ queryKey: ["positions"] }, (old: PositionListResponse | undefined) => {
				if (!old?.data) return old;
				return {
					...old,
					data: old.data.filter((position: Position) => position.id !== deletedId),
				};
			});

			await queryClient.invalidateQueries({ queryKey: ["positions"] });
			await queryClient.invalidateQueries({ queryKey: ["positions-stats"] });
			await queryClient.refetchQueries({ queryKey: ["positions"], type: "active" });
			await queryClient.refetchQueries({ queryKey: ["positions-stats"], type: "active" });

			toast.success("Lavozim muvaffaqiyatli o'chirildi");
		},
		onError: (error: any) => {
			if (error.status === 500) {
				toast.warning("bu lavozimda xodimlar bor !");
				return;
			}

			toast.error(error?.response?.data?.message || "Lavozimni o'chirishda xatolik");
		},
	});
}
