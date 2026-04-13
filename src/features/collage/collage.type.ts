export interface CreateCollageDTO {
	name: string;
	imgUrl: string;
}
export interface Collage {
	id: number;
	name: string;
	imgUrl: string;
}
export interface CollageListResponse {
	success: boolean;
	message: string;
	data: Collage[];
}

export interface CollageCreateResponse {
	success: boolean;
	message: string;
	data: Collage;
}