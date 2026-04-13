import { useQuery } from "@tanstack/react-query";
import { TeacherService } from "@/features/teacher/teacher.service";

/**
 * GET /teacher/{id} — backend `/teacher/user/{id}` yo'lini static resource deb qaytaradi.
 */
export function useTeacherId(id: number | undefined) {
	const safeId = typeof id === "number" && id > 0 ? id : null;

	return useQuery({
		queryKey: ["teacher", "detail", safeId ?? "pending"],
		queryFn: () => TeacherService.getById(safeId!),
		enabled: safeId != null,
		retry: false,
		staleTime: Number.POSITIVE_INFINITY,
		gcTime: 30 * 60 * 1000,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});
}
