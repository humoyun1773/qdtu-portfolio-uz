import { collageService } from "@/features/collage/collage.service";
import { fileService } from "@/features/file/file.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateCollageDto {
  id: number;
  data: {
    name: string;
    image?: File;
  };
}

export function useUpdateCollage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateCollageDto) => {
      let updateData: any = { name: data.name };
      
      if (data.image) {
        const imgUrl = await fileService.uploadImage(data.image);
        updateData.imgUrl = imgUrl;
      }
      
      return collageService.update(id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collages"] });
      toast.success("Fakultet muvaffaqiyatli yangilandi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Fakultetni yangilashda xatolik");
    },
  });
}
