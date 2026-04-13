import { TeacherService } from "@/features/teacher/teacher.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useTeacherComplation(id: number | undefined) {
	const safeId = typeof id === "number" && id > 0 ? id : null;
	const [allowFetch, setAllowFetch] = useState(true);

	useEffect(() => {
		setAllowFetch(true);
	}, [safeId]);

	const query = useQuery({
		queryKey: ["teacher-completion", safeId ?? "pending"],
		queryFn: () => TeacherService.getCompletion(safeId!),
		enabled: allowFetch && safeId != null,
		retry: false,
		staleTime: Number.POSITIVE_INFINITY,
		gcTime: 30 * 60 * 1000,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});

	useEffect(() => {
		if (query.isError) setAllowFetch(false);
	}, [query.isError]);

	return query;
}
