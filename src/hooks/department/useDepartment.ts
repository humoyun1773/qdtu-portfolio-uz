import { useQuery } from "@tanstack/react-query";
import { departmentService } from "@/features/departments/department.service";
import type { DepartmentListResponse } from "@/features/departments/department.type";

export function useDepartment() {
	return useQuery<DepartmentListResponse>({
		queryKey: ["departments"],
		queryFn: () => departmentService.getAll(),
	});
}
