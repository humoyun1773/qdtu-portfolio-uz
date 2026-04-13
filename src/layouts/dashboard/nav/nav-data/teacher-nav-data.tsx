import { Icon } from "@/components/icon";
import type { NavProps } from "@/components/nav";

export const teacherNavData: NavProps["data"] = [
	{
		name: "Asosiy",
		items: [
			{
				title: "Bosh Sahifa",
				path: "/teacher-dashboard",
				icon: <Icon icon="lucide:layout-dashboard" size="24" />,
			},
		],
	},
	{
		name: "Portfolio",
		items: [
			{
				title: "Profilim",
				path: "/teacher-dashboard/profile",
				icon: <Icon icon="lucide:user" size="24" />,
			},
			{
				title: "Tadqiqotlarim",
				path: "/teacher-dashboard/researches",
				icon: <Icon icon="lucide:flask-conical" size="24" />,
			},
			{
				title: "Nashrlarim",
				path: "/teacher-dashboard/publications",
				icon: <Icon icon="lucide:book-text" size="24" />,
			},
			{
				title: "Maslahatlarim",
				path: "/teacher-dashboard/consultations",
				icon: <Icon icon="lucide:trending-up" size="24" />,
			},
			{
				title: "Mukofotlarim",
				path: "/teacher-dashboard/awards",
				icon: <Icon icon="lucide:star" size="24" />,
			},
		],
	},
];
