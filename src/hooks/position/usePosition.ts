import { useQuery } from "@tanstack/react-query";
import { PositionService } from "@/features/position/position.service";
import type { PositionListResponse } from "@/features/position/position.type";

export function usePosition(search?: string) {
	return useQuery<PositionListResponse>({
		queryKey: ["positions", search ?? ""],
		queryFn: () => PositionService.getAll(search),
	});
}
