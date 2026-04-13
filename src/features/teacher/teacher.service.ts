import { apiClient } from "@/api/client";
import { TEACHER, USER_COMPLETION, USER_STATISTICS } from "@/constants/apiEndpoint";
import type {
  CreateTeacherParams,
  EditTeacherRequest,
  SearchParams,
  GetTeacherListResponse,
  GetTeacherByIdResponse,
  UpdateProfileRequestBody,
  CommonResponse,
  TeacherStatsResponse,
  TeacherComplationResponse,
} from "./teacher.type";

export const TeacherService = {
  getAll(params?: SearchParams) {
    return apiClient.get<GetTeacherListResponse>(TEACHER.SEARCH, { params });
  },

  getById(id: number) {
    return apiClient.get<GetTeacherByIdResponse>(`${TEACHER.DELETE}/${id}`);
  },

  create(params: CreateTeacherParams) {
    return apiClient.post<CommonResponse>(TEACHER.CREATE, params);
  },

  edit(params: EditTeacherRequest) {
    return apiClient.put<CommonResponse>(TEACHER.EDIT, params);
  },

  updateProfile(params: UpdateProfileRequestBody) {
    return apiClient.put<CommonResponse>(TEACHER.UPDATE_PROFILE, params);
  },

  delete(id: number) {
    return apiClient.delete<CommonResponse>(`${TEACHER.DELETE}/${id}`);
  },

  getStats(id: number) {
    return apiClient.get<TeacherStatsResponse>(`${USER_STATISTICS}/${id}`);
  },

  getCompletion(id: number) {
    return apiClient.get<TeacherComplationResponse>(`${USER_COMPLETION}/${id}`);
  }
};