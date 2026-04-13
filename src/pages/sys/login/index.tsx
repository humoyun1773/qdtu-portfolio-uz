import { GLOBAL_CONFIG } from "@/global-config";
import { useUserInfo, useUserToken } from "@/store/userStore";
import { useEffect } from "react";
import { Navigate } from "react-router";
import LoginForm from "./login-form";

function LoginPage() {
	const token = useUserToken();
	const userInfo = useUserInfo();

	useEffect(() => {
		document.title = "Login | QDTU";
	}, []);

	if (token.accessToken) {
		const isTeacher = userInfo.roles?.some((r) => r.code === "ROLE_TEACHER");
		return <Navigate to={isTeacher ? "/teacher-dashboard" : GLOBAL_CONFIG.defaultRoute} replace />;
	}

	return (
		<div className="min-h-svh flex items-center justify-center bg-background">
			<div className="w-full max-w-lg px-6">
				<LoginForm />
			</div>
		</div>
	);
}
export default LoginPage;
