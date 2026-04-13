import { useQuery } from "@tanstack/react-query";
import { MaslahatService } from "@/features/consultation/consultation.service";

export function useMaslahat(id: number) {
	return useQuery({
		queryKey: ["maslahat", id],
		queryFn: () => MaslahatService.getById(id),
		enabled: !!id,
	});
}
