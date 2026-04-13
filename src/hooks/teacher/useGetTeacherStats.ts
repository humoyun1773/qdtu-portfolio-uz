import { useQuery } from "@tanstack/react-query";
import { TeacherService } from "@/features/teacher/teacher.service";

export function useGetTeacherStats(userId: number | undefined) {
 return useQuery({
  queryKey: ["teacher-stats", userId],
  queryFn: () => TeacherService.getStats(userId!),
  enabled: !!userId,
  select: (res) => res.data,
 });
}