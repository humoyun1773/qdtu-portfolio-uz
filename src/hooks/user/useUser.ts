import { userService } from "@/features/user/user.service";
import { UserProfile } from "@/features/user/user.type";
import { useQuery } from "@tanstack/react-query";
import { useUserInfo } from "@/store/userStore";

export function useUser() {
	const role = useUserInfo().roles[0].code;

	return useQuery({
		queryKey: ["user", role],
		queryFn: async (): Promise<UserProfile> => {
			const response = await userService.getMe();

			return {
				id:response.data.id,
				fullName: response.data.fullName,
				phone: response.data.phone,
				imageUrl: response.data.imageUrl,
			};
		},
	});
}
