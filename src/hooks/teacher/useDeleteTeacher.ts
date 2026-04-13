import { TeacherService } from "@/features/teacher/teacher.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => TeacherService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("O'qituvchi muvaffaqiyatli o'chirildi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "O'qituvchini o'chirishda xatolik");
    },
  });
}