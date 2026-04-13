export type TimelineType = "research" | "publication" | "award" | "activity";
export type StatusType = "Faol" | "Senior" | "PhD";

export type TeacherDetail = {
	degree: string;
	bio: string;
	status: StatusType;
	researchScore: number;
	stats: {
		researches: number;
		publications: number;
		students: number;
		activities: number;
		awards: number;
	};
	subStats: {
		articles: number;
		books: number;
		conferences: number;
		supervised: number;
		international: number;
	};
	timeline: { date: string; text: string; type: TimelineType }[];
};

export const TEACHER_DETAILS: Record<number, TeacherDetail> = {
	1: {
		degree: "Tibbiyot fanlari doktori",
		bio: "20 yillik pedagogik tajribaga ega bo'lgan yuqori malakali mutaxassis. Ichki kasalliklar bo'yicha yetakchi tadqiqotchi.",
		status: "Senior",
		researchScore: 87,
		stats: { researches: 12, publications: 34, students: 156, activities: 8, awards: 5 },
		subStats: { articles: 28, books: 6, conferences: 14, supervised: 23, international: 9 },
		timeline: [
			{ date: "2024 Mart", text: "Xalqaro konferensiyada ma'ruza", type: "activity" },
			{ date: "2024 Yanvar", text: "Web of Science maqola nashr", type: "publication" },
			{ date: "2023 Noyabr", text: "Yil o'qituvchisi mukofoti", type: "award" },
		],
	},
	2: {
		degree: "Tibbiyot fanlari nomzodi",
		bio: "Jarrohlik sohasida ilmiy faoliyat olib boruvchi tajribali dotsent. Laparoskopik jarrohlik bo'yicha ixtisoslashgan.",
		status: "PhD",
		researchScore: 72,
		stats: { researches: 8, publications: 21, students: 98, activities: 5, awards: 3 },
		subStats: { articles: 18, books: 3, conferences: 9, supervised: 12, international: 5 },
		timeline: [
			{ date: "2024 Fevral", text: "Yangi tadqiqot loyihasi boshlandi", type: "research" },
			{ date: "2023 Dekabr", text: "Scopus maqola nashr", type: "publication" },
			{ date: "2023 Sentyabr", text: "Xalqaro workshop ishtirokchisi", type: "activity" },
		],
	},
};

export const DEFAULT_DETAIL: TeacherDetail = {
	degree: "Pedagogika fanlari nomzodi",
	bio: "Tajribali o'qituvchi va tadqiqotchi. Soha bo'yicha yuqori malakali mutaxassis.",
	status: "Faol",
	researchScore: 65,
	stats: { researches: 5, publications: 12, students: 74, activities: 3, awards: 2 },
	subStats: { articles: 10, books: 2, conferences: 6, supervised: 8, international: 3 },
	timeline: [
		{ date: "2024 Mart", text: "Konferensiya ishtirokchisi", type: "activity" },
		{ date: "2024 Yanvar", text: "Maqola nashr qilindi", type: "publication" },
	],
};

export const STATUS_STYLES: Record<StatusType, string> = {
	Faol: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
	Senior: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
	PhD: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-800",
};
