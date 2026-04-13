import { useQuery } from "@tanstack/react-query";
import { publicationService } from "@/features/publication/publication.service";

export function useNashr(id: number) {
	return useQuery({
		queryKey: ["nashr", id],
		queryFn: () => publicationService.getById(id),
		enabled: !!id,
	});
}
