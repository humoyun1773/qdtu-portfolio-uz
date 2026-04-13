import { apiClient } from "@/api/client";
import { NASHR } from "@/constants/apiEndpoint";
import type { EditResearchResponse } from "../research/research.type";
import type { GetbyIdResponse, PublicationCreateParams } from "./publication.type";

export const publicationService = {
	getById(id: number) {
		return apiClient.get<GetbyIdResponse>(`${NASHR.GETBYID}/${id}`);
	},
	delete(id: number) {
		return apiClient.delete<EditResearchResponse>(`${NASHR.DELETE}/${id}`);
	},
	edit(id: number | string, params: PublicationCreateParams) {
		return apiClient.put(`${NASHR.UPDATE}/${id}`, params);
	},
	create(params: PublicationCreateParams) {
		return apiClient.post(NASHR.CREATE, params);
	},
};
