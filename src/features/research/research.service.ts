import { apiClient } from "@/api/client";
import { RESEARCH } from "@/constants/apiEndpoint";
import type { EditResearchParams, EditResearchResponse, GetByIdResponse, ResearchCreateParams } from "./research.type";

export const ResearchService = {
	getById(id: number) {
		return apiClient.get<GetByIdResponse>(`${RESEARCH.GETBYID}/${id}`);
	},
	edit(id: number, params: EditResearchParams) {
		return apiClient.put<EditResearchResponse>(`${RESEARCH.UPDATE}/${id}`, params);
	},
	delete(id: number) {
		return apiClient.delete<EditResearchResponse>(`${RESEARCH.DELETE}/${id}`);
	},
	create(params: ResearchCreateParams) {
		return apiClient.post<EditResearchResponse>(RESEARCH.CREATE, params);
	},
};
