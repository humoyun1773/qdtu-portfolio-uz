import { useUserInfo } from "@/store/userStore";
import { Navigate, Outlet } from "react-router";

type Props = {
	teacherOnly?: boolean;
	adminOnly?: boolean;
};

export default function RoleAuthGuard({ adminOnly, teacherOnly }: Props) {
	const userInfo = useUserInfo();
	const isTeacher = userInfo.roles?.some((r) => r.code === "ROLE_TEACHER");
	if (teacherOnly && !isTeacher) {
		return <Navigate to={"/dashboard"} replace />;
	}

	if (adminOnly && isTeacher) {
		return <Navigate to={"/teacher-dashboard"} replace />;
	}

	return <Outlet />;
}
