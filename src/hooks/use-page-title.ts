import { useEffect } from "react";
import { useLocation } from "react-router";

const pageTitles: Record<string, string> = {
	"/dashboard": "QDTU | Boshqaruv Paneli",
	"/analysis": "QDTU | Analitika",
	"/faculties": "QDTU | Fakultetlar",
	"/departments": "QDTU | Kafedralar",
	"/teachers": "QDTU | O'qituvchilar",
	"/positions": "QDTU | Lavozimlar",
	"/error/403": "QDTU | 403",
	"/error/404": "QDTU | 404",
	"/error/500": "QDTU | 500",
};

export function usePageTitle() {
	const { pathname } = useLocation();

	useEffect(() => {
		document.title = pageTitles[pathname] ?? "QDTU";
	}, [pathname]);
}
