import { collageService } from "@/features/collage/collage.service";
import { CreateCollageDTO } from "@/features/collage/collage.type";
import { fileService } from "@/features/file/file.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateCollageInput {
	name: string;
	image: File;
}

export function useCreateCollage() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: CreateCollageInput) => {
			const imgUrl = await fileService.uploadImage(input.image);
			const collageData: CreateCollageDTO = {
				name: input.name,
				imgUrl,
			};

			return collageService.create(collageData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["collages"] });
			toast.success("Fakultet muvaffaqiyatli qo'shildi");
		},
		onError: (error: { message: string }) => {
			toast.success(error.message || "Fakultet qo'shishda xatolik");
		},
	});
}
