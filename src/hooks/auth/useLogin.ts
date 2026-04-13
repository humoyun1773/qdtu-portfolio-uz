import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { authService } from "@/features/auth/api/auth.service";
import type { LoginDTO } from "@/features/auth/api/auth.type";
import { useUserActions } from "@/store/userStore";
import type { UserInfo } from "@/types/entity";

export default function useLogin() {
	const navigate = useNavigate();
	const { setUserToken, setUserInfo } = useUserActions();

	return useMutation({
		mutationFn: (data: LoginDTO) => authService.login(data),
		onSuccess: (response) => {
			if (!response.success) {
				toast.error("Raqam yokida parol noto'g'ri", { position: "top-center" });
				return;
			}
			const role = response.message;
			setUserInfo({ roles: [{ code: role }] } as UserInfo);
			setUserToken({ accessToken: response.data });

			if (role === "ROLE_ADMIN") {
				navigate("/dashboard", { replace: true });
			} else if (role === "ROLE_TEACHER") {
				navigate("/teacher-dashboard", { replace: true });
			} else {
				navigate("/dashboard", { replace: true });
			}
			toast.success("Tizimga muvaffaqiyatli kirdingiz!", { position: "bottom-right" });
		},
		onError: () => {
			toast.error("Bunaqa foydalanuvchi mavjud emas", { position: "top-center" });
		},
	});
}
