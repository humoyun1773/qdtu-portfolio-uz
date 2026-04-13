import { apiClient } from "@/api/client";
import { NAZORAT } from "@/constants/apiEndpoint";
import type { EditResearchResponse } from "../research/research.type";
import type { GetbyIdResponse, NazoratCreateDTO } from "./nazorat.type";

export const NazoratService = {
	getById(id: number) {
		return apiClient.get<GetbyIdResponse>(`${NAZORAT.GETBYID}/${id}`);
	},
	delete(id: number) {
		return apiClient.delete<EditResearchResponse>(`${NAZORAT.DELETE}/${id}`);
	},
	edit(id: number | string, params: NazoratCreateDTO) {
		return apiClient.put(`${NAZORAT.UPDATE}/${id}`, params);
	},
	create(params: NazoratCreateDTO) {
		return apiClient.post(NAZORAT.CREATE, params);
	},
};
