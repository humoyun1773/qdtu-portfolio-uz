import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { publicationService } from "@/features/publication/publication.service";

export function useDeleteNashr() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => publicationService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["nashr"] });
			toast.success("Nashr muvaffaqiyatli o'chirildi");
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Nashrni o'chirishda xatolik");
		},
	});
}
