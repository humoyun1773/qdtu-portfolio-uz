import { apiClient } from "@/api/client";
import { POSITION } from "@/constants/apiEndpoint";
import type {
	CreatePositionDTO,
	IApiResponse,
	Position,
	PositionCreateResponse,
	PositionDeleteResponse,
	PositionListResponse,
} from "./position.type";

export const PositionService = {
	getAll(search?: string) {
		const term = search?.trim();
		return apiClient.get<PositionListResponse>(POSITION.LAVOZIM, {
			params: term
				? {
						name: term,
						search: term,
						keyword: term,
						query: term,
					}
				: undefined,
		});
	},
	create(data: CreatePositionDTO) {
		return apiClient.post<PositionCreateResponse>(POSITION.LAVOZIM, data);
	},
	delete(id: number) {
		return apiClient.delete<PositionDeleteResponse>(`/lavozim/${id}`);
	},
	update(id: number, data: Partial<Position>) {
		return apiClient.put<{ success: boolean; message: string }>(`${POSITION.LAVOZIM}/${id}`, data);
	},
	getStatistik() {
		return apiClient.get<IApiResponse>(`${POSITION.STATISTIC}`);
	},
};
