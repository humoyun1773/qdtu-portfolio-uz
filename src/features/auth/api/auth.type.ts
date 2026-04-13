export interface LoginDTO {
	phone: string;
	password: string;
}

export interface LoginResponse {
	success: boolean;
	message: string;
	data: string; //token
}
