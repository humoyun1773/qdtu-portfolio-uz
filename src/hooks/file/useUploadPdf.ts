import { fileService } from "@/features/file/file.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUploadPdf() {
	return useMutation({
		mutationFn: (file: File) => fileService.uploadPdf(file),
		onSuccess: () => {
			toast.success("Fayl yuklandi");
		},
		onError: (error: { message: string }) => {
			toast.error(error.message || "Fayl yuklashda xatolik ");
		},
	});
}
