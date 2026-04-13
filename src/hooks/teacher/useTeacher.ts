import { TeacherService } from "@/features/teacher/teacher.service";
import { useQuery } from "@tanstack/react-query";

export function useTeacher() {
	return useQuery({
		queryKey: ["teachers"],
		queryFn: () => TeacherService.getAll(),
	});
}
