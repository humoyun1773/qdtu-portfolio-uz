import { departmentService } from "@/features/departments/department.service";
import { fileService } from "@/features/file/file.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateDepartmentDto {
  id: number;
  collegeId: number;
  data: {
    name: string;
    image?: File;
  };
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, collegeId, data }: UpdateDepartmentDto) => {
      let updateData: any = { name: data.name, collegeId };
      
      if (data.image) {
        const imgUrl = await fileService.uploadImage(data.image);
        updateData.imgUrl = imgUrl;
      }
      
      return departmentService.update(id, updateData); // ✅ id path'ga uzatiladi
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Kafedra muvaffaqiyatli yangilandi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Kafedrani yangilashda xatolik");
    },
  });
}