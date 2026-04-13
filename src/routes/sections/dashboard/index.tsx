import { Navigate, type RouteObject } from "react-router";
import { GLOBAL_CONFIG } from "@/global-config";
import DashboardLayout from "@/layouts/dashboard";
import LoginAuthGuard from "@/routes/components/login-auth-guard";
import { getDashboardRoutes } from "./routes";
import TokenGuard from "@/components/TokenGuard";

export const dashboardRoutes: RouteObject[] = [
	{
		element: (
			<LoginAuthGuard>
				<TokenGuard>
					<DashboardLayout />
				</TokenGuard>
			</LoginAuthGuard>
		),
		children: [...getDashboardRoutes()],
	},
];
