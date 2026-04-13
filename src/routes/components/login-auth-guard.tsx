import { useUserToken } from "@/store/userStore";
import React, { useEffect } from "react";
import { useRouter } from "../hooks";

type Props = {
	children: React.ReactNode;
};

export default function LoginAuthGuard({ children }: Props) {
	const router = useRouter();
	const { accessToken } = useUserToken();

	useEffect(() => {
		if (!accessToken) {
			router.replace("auth/login");
		}
	}, [accessToken, router]);

	if (!accessToken) {
		return null;
	}

	return <>{children}</>;
}
