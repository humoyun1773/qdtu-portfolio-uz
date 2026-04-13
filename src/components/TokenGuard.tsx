// src/components/TokenGuard.tsx

import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import useUserStore, { useUserActions } from "@/store/userStore";

// Shu yerdagi raqamni o'zgartirasiz
// Test: 60 * 1000 (1 daqiqa)
// Production: 24 * 60 * 60 * 1000 (24 soat)
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000;

const CHECK_INTERVAL = 60 * 60 * 1000;

export default function TokenGuard({ children }: { children: React.ReactNode }) {
	const navigate = useNavigate();
	const { clearUserInfoAndToken } = useUserActions();

	const checkToken = useCallback(() => {
		const { userToken, tokenTimestamp } = useUserStore.getState();

		if (!userToken?.accessToken) return;

		const isExpired = !tokenTimestamp || Date.now() - tokenTimestamp > TOKEN_EXPIRY;

		if (isExpired) {
			clearUserInfoAndToken();
			toast.error("Sessiya muddati tugadi, qayta kiring");
			navigate("/auth/login/", { replace: true });
		}
	}, [clearUserInfoAndToken, navigate]);

	useEffect(() => {
		checkToken();

		const interval = setInterval(checkToken, CHECK_INTERVAL);

		const handleVisibility = () => {
			if (document.visibilityState === "visible") {
				checkToken();
			}
		};
		document.addEventListener("visibilitychange", handleVisibility);

		return () => {
			clearInterval(interval);
			document.removeEventListener("visibilitychange", handleVisibility);
		};
	}, [checkToken]);

	return <>{children}</>;
}
