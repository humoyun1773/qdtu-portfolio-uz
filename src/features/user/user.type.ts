export interface UserResponse {
	success: boolean;
	message: string;
	data: {
		id: number;
		fullName: string;
		phone: string;
		email: string;
		imageUrl: string | null;
		role: string;
	};
}

export interface UserProfile {
	id:number;
	fullName: string;
	phone: string;
	imageUrl: string | null;
}
