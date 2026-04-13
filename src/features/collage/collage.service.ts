import { apiClient } from "@/api/client";
import { Collage } from "./collage.type";
import type { CollageListResponse, CollageCreateResponse, CreateCollageDTO } from "./collage.type";
import { COLLAGE } from "@/constants/apiEndpoint";

export const collageService = {
	getAll() {
		return apiClient.get<CollageListResponse>(COLLAGE.GETALL);
	},
	create(data: CreateCollageDTO) {
		return apiClient.post<CollageCreateResponse>(COLLAGE.CREATE, data);
	},
	delete(id: number) {
		return apiClient.delete(`/college/${id}`);
	},
	update(id: number, data: Partial<Collage>) {
		return apiClient.put<{ success: boolean; message: string }>(`${COLLAGE.UPDATE}/${id}`, data);
	},
};
