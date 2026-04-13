import { apiClient } from "@/api/client";
import { UserResponse } from "./user.type";
import { USER } from "@/constants/apiEndpoint";

export const userService = {
	getMe() {
		return apiClient.get<UserResponse>(USER.USER_ME);
	},
};

