import { Icon } from "@/components/icon";
import type { NavProps } from "@/components/nav";

export const navData: NavProps["data"] = [
	{
		name: "Statistika",
		items: [
			{
				title: "Boshqaruv Paneli",
				path: "/dashboard",
				icon: <Icon icon="local:ic-workbench" size="24" />,
			},
			{
				title: "Analitika",
				path: "/analysis",
				icon: <Icon icon="local:ic-analysis" size="24" />,
			},
		],
	},
	{
		name: "Boshqaruv",
		items: [
			{
				title: "Fakultetlar",
				path: "/faculties",
				icon: <Icon icon="lucide:building-2" size="24" />,
			},
			{
				title: "Kafedralar",
				path: "/departments",
				icon: <Icon icon="lucide:layers" size="24" color="#637281" />,
			},
			{
				title: "O'qituvchilar",
				path: "/teachers",
				icon: <Icon icon="lucide:graduation-cap" size="24" />,
			},
			{
				title: "Lavozimlar",
				path: "/positions",
				icon: <Icon icon="lucide:briefcase" size="24" />,
			},
			{
				title: "Error Pages",
				path: "/error",
				icon: <Icon icon="bxs:error-alt" size="24" />,
				children: [
					{
						title: "403",
						path: "/error/403",
					},
					{
						title: "404",
						path: "/error/404",
					},
					{
						title: "500",
						path: "/error/500",
					},
				],
			},
		],
	},
];
