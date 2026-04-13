export interface CreatePositionDTO {
	name: string;
}
export interface Position {
	id: number;
	name: string;
}

export interface PositionListResponse {
	success: boolean;
	message: string;
	data: Position[];
}
export interface PositionCreateResponse {
	success: boolean;
	message: string;
	data: Position;
}

export interface PositionDeleteResponse {
	success: boolean;
	message: string;
	data: string | null;
}
export interface PositionStatistic {
	name: string;
	totalEmployees: number;
}
interface IEmployeeData {
	total: number;
	data: PositionStatistic[];
}

export interface IApiResponse {
	success: boolean;
	message: string;
	data: IEmployeeData;
}
