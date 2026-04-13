export interface CreateDepartmentDTO {
	name: string;
	imgUrl: string;
	collegeId: number;
}
export interface Department {
  id: number;
  name: string;
  imgUrl: string;
  collegeId: number;
}
export interface DepartmentListResponse {
	success: boolean;
	message: string;
	data: Department[];
}

export interface DepartmentCreateResponse {
	success: boolean;
	message: string;
	data: Department;
}