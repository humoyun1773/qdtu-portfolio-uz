import { useQuery } from "@tanstack/react-query";
import { MukofotService } from "@/features/mukofot/mukofot.service";

export function useMukofot(id: number) {
	return useQuery({
		queryKey: ["mukofot", id],
		queryFn: () => MukofotService.getById(id),
		enabled: !!id,
	});
}
