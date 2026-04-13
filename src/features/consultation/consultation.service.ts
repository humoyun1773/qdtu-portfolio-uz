import { apiClient } from "@/api/client";
import { MASLAHAT } from "@/constants/apiEndpoint";
import type { ApiResponse, ConsultationRequest, GetbyIdResponse } from "./consultation.type";

export const MaslahatService = {
	getById(id: number) {
		return apiClient.get<GetbyIdResponse>(`${MASLAHAT.GETBYID}/${id}`);
	},
	delete(id: number) {
		return apiClient.delete<ApiResponse>(`${MASLAHAT.DELETE}/${id}`);
	},
	edit(id: number | string, params: ConsultationRequest) {
		return apiClient.put(`${MASLAHAT.UPDATE}/${id}`, params);
	},
	create(params: ConsultationRequest) {
		return apiClient.post(MASLAHAT.CREATE, params);
	},
};
