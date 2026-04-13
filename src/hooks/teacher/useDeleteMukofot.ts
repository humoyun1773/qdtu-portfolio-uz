import { MukofotService } from "@/features/mukofot/mukofot.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteMukofot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => MukofotService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mukofot"] });
      toast.success("Mukofot muvaffaqiyatli o'chirildi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Mukofotni o'chirishda xatolik");
    },
  });
}