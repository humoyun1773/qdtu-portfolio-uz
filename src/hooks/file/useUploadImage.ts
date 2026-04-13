import { fileService } from "@/features/file/file.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUploadImage() {
	return useMutation({
		mutationFn: (file: File) => fileService.uploadImage(file),
		onSuccess: () => {
			toast.success("Rasm yuklandi");
		},
		onError: (error: { message: string }) => {
			toast.error(error.message || "Rasm yuklashda xatolik ");
		},
	});
}
