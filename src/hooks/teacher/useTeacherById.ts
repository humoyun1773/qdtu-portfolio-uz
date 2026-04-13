import { TeacherService } from "@/features/teacher/teacher.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export function useTeacherById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id:number) => {
      return TeacherService.getById(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers","teacher-detail"] });
      toast.success("O'qituvchiga muvaffaqiyatli o'tildi");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "O'qituvchiga o'tishda xatolik"
      );
    },
  });
}