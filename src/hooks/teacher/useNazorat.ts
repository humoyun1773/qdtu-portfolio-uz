import { useQuery } from "@tanstack/react-query";
import { NazoratService } from "@/features/nazorat/nazorat.service";

export function useNazorat(id: number) {
	return useQuery({
		queryKey: ["nazorat", id],
		queryFn: () => NazoratService.getById(id),
		enabled: !!id,
	});
}
