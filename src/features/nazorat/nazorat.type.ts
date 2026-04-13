export type NazoratItem = {
  id: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  researcherName: string;
  univerName: string;
  level: "quyi" | "o'rta" | "yuqori";
  memberEnum: "MILLIY" | "XALQARO";
  finished: boolean;
  member?: boolean;
}
interface NazoratData {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: NazoratItem[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: NazoratData;
}
interface PaginationData<T> {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: T;
}

export interface GetbyIdResponse {
  success: boolean;
  message: string;
  data: PaginationData<NazoratItem>;
}
export interface NazoratCreateDTO {
	name: string;
	description: string;
	year: number;
	fileUrl: string;
	userId: number;
	researcherName: string;
	univerName: string;
	level: string;
	memberEnum: "MILLIY" | "XALQARO";
	finished: boolean;
}