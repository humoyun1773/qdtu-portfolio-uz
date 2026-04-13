import { ResearchService } from "@/features/research/research.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteResearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ResearchService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research"] });
      toast.success("Tatqiqot muvaffaqiyatli o'chirildi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Tatqiqotni o'chirishda xatolik");
    },
  });
}