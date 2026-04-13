import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ResearchService } from "@/features/research/research.service";

interface EditResearchInput {
	id: number;
	name: string;
	description: string;
	year: number;
	fileUrl: string;
	userId: number;
	member: boolean;
	univerName: string;
	finished: boolean;
	memberEnum: "MILLIY" | "XALQARO";
}

export function useEditResearch() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: EditResearchInput) => {
			return ResearchService.edit(input.id, {
				name: input.name,
				description: input.description,
				fileUrl: input.fileUrl,
				finished: input.finished,
				member: input.member,
				memberEnum: input.memberEnum,
				univerName: input.univerName,
				userId: input.userId,
				year: input.year,
			});
		},
		onSuccess: async (_data, variables) => {
			await queryClient.invalidateQueries({ queryKey: ["research", variables.userId] });
			await queryClient.invalidateQueries({ queryKey: ["teacher-stats", variables.userId] });
			await queryClient.invalidateQueries({ queryKey: ["teacher-completion", variables.userId] });
			await queryClient.refetchQueries({ queryKey: ["research", variables.userId], type: "active" });
			await queryClient.refetchQueries({ queryKey: ["teacher-stats", variables.userId], type: "active" });
			await queryClient.refetchQueries({ queryKey: ["teacher-completion", variables.userId], type: "active" });
			toast.success("Tatqiqot muvaffaqiyatli tahrirlandi");
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Taqdimotni tahrirlashda xatolik");
		},
	});
}
