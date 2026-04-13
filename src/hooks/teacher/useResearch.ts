import { useQuery } from "@tanstack/react-query";
import { ResearchService } from "@/features/research/research.service";

export function useResearch(id: number) {
	return useQuery({
		queryKey: ["research", id],
		queryFn: () => ResearchService.getById(id),
		enabled: !!id,
	});
}
