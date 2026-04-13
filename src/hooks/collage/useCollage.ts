import { collageService } from "@/features/collage/collage.service";
import { useQuery } from "@tanstack/react-query";

export function useCollage() {
	return useQuery({
		queryKey: ["collages"],
		queryFn: () => collageService.getAll(),
	});
}
