import { useQuery } from "@tanstack/react-query";
import { PositionService } from "@/features/position/position.service";

export function useStatsPosition() {
	return useQuery({
		queryKey: ["positions-stats"],
		queryFn: () => PositionService.getStatistik(),
	});
}
