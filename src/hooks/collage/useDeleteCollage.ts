import { collageService } from "@/features/collage/collage.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteCollage() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: number) => {
			return collageService.delete(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["collages"] });
			toast.success("Fakultet muvaffaqiyatli o'chirildi");
		},
		onError: (error: { message: string }) => {
			toast.error(error.message || "Fakultetni o'chirishda xatolik");
		},
	});
}