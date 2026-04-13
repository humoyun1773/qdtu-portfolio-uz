interface ConsultationItem {
  id: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  member: boolean;
  finishedEnum: "FINISHED" | "IN_PROGRESS" | "REJECTED";
  leader: string;
}
interface ConsultationData {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: ConsultationItem[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: ConsultationData;
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
  data: PaginationData<ConsultationItem>;
}

// create and Edit types

export interface ConsultationRequest {
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  member: boolean;
  finishedEnum: "COMPLETED" | "IN_PROGRESS" | "FINISHED";
  leader: string;
}
