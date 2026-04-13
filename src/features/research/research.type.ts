export type ResearchItem = {
  id: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  member: boolean;
  univerName: string;
  finished: boolean;
  memberEnum: "MILLIY" | "XALQARO";
}
export interface GetByIdResponse {
  success: boolean;
  message: string;
  data: {
    page: number;
    size: number;
    totalPage: number;
    totalElements: number;
    body: ResearchItem[];
  };
}
export type EditResearchParams = {
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  member: boolean;
  univerName: string;
  finished: boolean;
  memberEnum: "MILLIY" | "XALQARO";
}
export type EditResearchResponse={
  success: true,
  message: string,
  data: string
}
export interface ResearchCreateParams {
	name: string;
	description: string;
	year: number;
	fileUrl: string;
	userId: number;
	member: boolean;
	univerName: string;
	finished: boolean;
	memberEnum: "MILLIY" | "XALQARO";
}