import { DataTable } from "@/components/data-table/data-table";
import type { ColumnDef } from "@/components/data-table/data-table";
import Icon from "@/components/icon/icon";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/ui/card";

// TODO: Replace with real API data
const stats = [
	{ label: "Jami O'qituvchilar", value: 248, icon: "mdi:account-group", color: "bg-blue-100", iconColor: "#1d4ed8" },
	{ label: "Erkak O'qituvchilar", value: 142, icon: "mdi:account-tie", color: "bg-cyan-100", iconColor: "#0e7490" },
	{ label: "Ayol O'qituvchilar", value: 106, icon: "mdi:account-heart", color: "bg-pink-100", iconColor: "#be185d" },
	{ label: "Ilmiy Darajalar Bilan", value: 87, icon: "mdi:school", color: "bg-purple-100", iconColor: "#7e22ce" },
];

const kafedraStats = [
	{ label: "Jami bo'limlar", value: 12, icon: "mdi:office-building", bg: "bg-orange-500" },
	{ label: "Jami tadqiqotlar", value: 34, icon: "mdi:flask", bg: "bg-green-500" },
	{ label: "Fakultetda faol xodimlar", value: 198, icon: "mdi:account-check", bg: "bg-blue-500" },
	{ label: "Bu oy taqdimnoma", value: 7, icon: "mdi:presentation", bg: "bg-violet-500" },
];

const lavozimlarStats = [
	{ label: "Professorlar", value: 18, icon: "mdi:account-star", border: "border-l-amber-500" },
	{ label: "Dotsentlar", value: 45, icon: "mdi:account-badge", border: "border-l-blue-500" },
	{ label: "Katta o'qituvchilar", value: 97, icon: "mdi:account-school", border: "border-l-green-500" },
	{ label: "Assistentlar", value: 88, icon: "mdi:account-student", border: "border-l-rose-500" },
];

const ilmiyFaoliyat = [
	{ label: "Nashr etilgan maqolalar", value: 312, icon: "mdi:newspaper-variant", iconColor: "#0369a1" },
	{ label: "Patentlar va ixtirolar", value: 24, icon: "mdi:certificate", iconColor: "#b45309" },
	{ label: "Xalqaro konferensiyalar", value: 56, icon: "mdi:earth", iconColor: "#047857" },
	{ label: "Loyihalar soni", value: 19, icon: "mdi:briefcase", iconColor: "#7c3aed" },
];

const talimDarajalari = [
	{ label: "Fan doktorlari (DSc)",rawColor: "#3b82f6", value: 23, icon: "mdi:medal", color: "text-amber-500", bg: "bg-amber-50" },
	{
		label: "Falsafa doktorlari (PhD)",
		rawColor: "#3b82f6",
		value: 64,
		icon: "mdi:school-outline",
		color: "text-blue-600",
		bg: "bg-blue-50",
	},
	{ label: "Magistrlar",rawColor: "#3b82f6", value: 161, icon: "mdi:book-education", color: "text-emerald-600", bg: "bg-emerald-50" },
];

const yillikFaoliyat = [
	{
		label: "Bu yil qo'shilgan o'qituvchilar",
		value: 14,
		icon: "mdi:account-plus",
		badge: "bg-green-100 text-green-700",
	},
	{ label: "Shartnomasi tugayotganlar", value: 8, icon: "mdi:file-clock", badge: "bg-red-100 text-red-700" },
	{ label: "Xorijiy tajribadan qaytganlar", value: 5, icon: "mdi:airplane-landing", badge: "bg-sky-100 text-sky-700" },
	{
		label: "Attestatsiyadan o'tganlar",
		value: 112,
		icon: "mdi:check-decagram",
		badge: "bg-purple-100 text-purple-700",
	},
];

const engFaolBolim = {
	nomi: "Farmatsiya va kimyo kafedrasi",
	taqdimotlar: 3024,
};

const oxirgiFailiyat = {
	ism: "KUZIEV OTABEK JURAKULOVICH",
	vaqt: "21 soat oldin",
};

type KafedraRow = {
	nomi: string;
	fakultet: string;
	taqdimotlar: number;
	xodimlar: number;
	oxirgiKim: string;
	oxirgiVaqt: string;
	oxirgiSana: string;
};

const kafedraColumns: ColumnDef<KafedraRow>[] = [
	{
		accessorKey: "nomi",
		header: "Kafedra Nomi",
		cell: ({ row }) => <span className="font-medium">{row.getValue("nomi")}</span>,
	},
	{
		accessorKey: "fakultet",
		header: "Fakultet",
		cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("fakultet")}</span>,
	},
	{
		accessorKey: "taqdimotlar",
		header: () => <div className="text-right">Jami Taqdimotlar</div>,
		cell: ({ row }) => (
			<div className="text-right font-bold">{(row.getValue("taqdimotlar") as number).toLocaleString()}</div>
		),
	},
	{
		accessorKey: "xodimlar",
		header: () => <div className="text-right">Kafedra Xodimlari</div>,
		cell: ({ row }) => (
			<div className="text-right">
				<span className="bg-blue-100 text-blue-700 text-[12px] font-semibold px-2 py-0.5 rounded-full">
					{row.getValue("xodimlar") as number}
				</span>
			</div>
		),
	},
	{
		accessorKey: "oxirgiKim",
		header: "Oxirgi Yuborish",
		cell: ({ row }) => (
			<div className="flex flex-col gap-0.5">
				<span className="font-medium">{row.getValue("oxirgiKim")}</span>
				<span className="text-[11px] text-muted-foreground">
					{row.original.oxirgiVaqt} · {row.original.oxirgiSana}
				</span>
			</div>
		),
	},
];

const kafedraTable = [
	{
		nomi: "Farmatsiya va kimyo kafedrasi",
		fakultet: "Stomatologiya va Farmatsiya fakulteti",
		taqdimotlar: 3024,
		xodimlar: 39,
		oxirgiKim: "TURSUNQULOV J. B.",
		oxirgiVaqt: "1 kun oldin",
		oxirgiSana: "Fevral 26, 2026 04:43",
	},
	{
		nomi: "Ichki kasalliklar kafedrasi",
		fakultet: "Davolash fakulteti",
		taqdimotlar: 2781,
		xodimlar: 45,
		oxirgiKim: "YUSUPOVA M. A.",
		oxirgiVaqt: "2 kun oldin",
		oxirgiSana: "Fevral 25, 2026 11:20",
	},
	{
		nomi: "Jarrohlik kafedrasi",
		fakultet: "Davolash fakulteti",
		taqdimotlar: 2390,
		xodimlar: 38,
		oxirgiKim: "RAHIMOV B. T.",
		oxirgiVaqt: "3 kun oldin",
		oxirgiSana: "Fevral 24, 2026 09:15",
	},
	{
		nomi: "Bolalar kasalliklari kafedrasi",
		fakultet: "Pediatriya fakulteti",
		taqdimotlar: 1856,
		xodimlar: 32,
		oxirgiKim: "QODIROV S. N.",
		oxirgiVaqt: "4 kun oldin",
		oxirgiSana: "Fevral 23, 2026 14:30",
	},
	{
		nomi: "Stomatologiya kafedrasi",
		fakultet: "Stomatologiya va Farmatsiya fakulteti",
		taqdimotlar: 1624,
		xodimlar: 28,
		oxirgiKim: "MIRZAYEVA D. X.",
		oxirgiVaqt: "5 kun oldin",
		oxirgiSana: "Fevral 22, 2026 10:05",
	},
	{
		nomi: "Akusherlik va ginekologiya",
		fakultet: "Tibbiy profilaktika fakulteti",
		taqdimotlar: 1432,
		xodimlar: 25,
		oxirgiKim: "HASANOV A. R.",
		oxirgiVaqt: "1 hafta oldin",
		oxirgiSana: "Fevral 19, 2026 16:45",
	},
	{
		nomi: "Nevrologiya kafedrasi",
		fakultet: "Davolash fakulteti",
		taqdimotlar: 1287,
		xodimlar: 22,
		oxirgiKim: "ISLOMOV F. K.",
		oxirgiVaqt: "1 hafta oldin",
		oxirgiSana: "Fevral 18, 2026 08:50",
	},
	{
		nomi: "Biokimyo kafedrasi",
		fakultet: "Tibbiy biologiya fakulteti",
		taqdimotlar: 987,
		xodimlar: 19,
		oxirgiKim: "NAZAROVA G. I.",
		oxirgiVaqt: "2 hafta oldin",
		oxirgiSana: "Fevral 12, 2026 13:10",
	},
];

export default function Workbench() {
	return (
		<div className="flex flex-col gap-6 w-full">
			{/* 1. Asosiy o'qituvchilar statistikasi */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{stats.map((stat) => (
					<Card key={stat.label}>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle>
								<span className="text-[12px] font-medium text-muted-foreground">{stat.label}</span>
							</CardTitle>
							<CardAction className={`rounded-full ${stat.color} p-2 w-10 h-10 flex items-center justify-center`}>
								<Icon icon={stat.icon} size={20} color={stat.iconColor} />
							</CardAction>
						</CardHeader>
						<CardContent>
							<span className="text-[24px] font-bold">{stat.value.toLocaleString()}</span>
						</CardContent>
					</Card>
				))}
			</div>

			{/* 2. Lavozimlar bo'yicha */}
			<div className="flex flex-col gap-3">
				<span className="text-[14px] font-semibold">Lavozimlar bo'yicha</span>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
					{lavozimlarStats.map((stat) => (
						<Card key={stat.label} className={`border-l-4 ${stat.border} py-0`}>
							<CardContent className="flex items-center justify-between px-4 py-3">
								<div className="flex flex-col gap-0.5">
									<span className="text-[12px] text-muted-foreground leading-tight">{stat.label}</span>
									<span className="text-[20px] font-bold leading-tight">{stat.value}</span>
								</div>
								<Icon icon={stat.icon} size={28} className="text-muted-foreground opacity-30" />
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* 3. Ilmiy Faoliyat */}
			<div className="flex flex-col gap-3">
				<span className="text-[14px] font-semibold">Ilmiy Faoliyat</span>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
					{ilmiyFaoliyat.map((stat) => (
						<Card key={stat.label} className="py-0">
							<CardContent className="flex flex-col items-center justify-center gap-1 px-4 py-4 text-center">
								<Icon icon={stat.icon} size={28} color={stat.iconColor} />
								<span className="text-[22px] font-bold leading-tight">{stat.value.toLocaleString()}</span>
								<span className="text-[11px] text-muted-foreground leading-tight">{stat.label}</span>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* 4. Ta'lim Darajalari */}
			<div className="flex flex-col gap-3">
				<span className="text-[14px] font-semibold">Ta'lim Darajalari</span>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
					{talimDarajalari.map((stat) => (
						<Card
							key={stat.label}
							className="border-0 py-0 bg-muted/50 dark:bg-muted/20 hover:bg-muted/70 dark:hover:bg-muted/30 transition-colors"
						>
							<CardContent className="flex items-center gap-4 px-5 py-4">
								<div className="p-2 rounded-xl" style={{ backgroundColor: `${stat.rawColor}20` }}>
									<Icon icon={stat.icon} size={28} className={stat.color} />
								</div>
								<div className="flex flex-col gap-0.5">
									<span className="text-[12px] text-muted-foreground leading-tight">{stat.label}</span>
									<span className={`text-[22px] font-bold leading-tight ${stat.color}`}>{stat.value}</span>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* 5. Yillik Faoliyat */}
			<div className="flex flex-col gap-3">
				<span className="text-[14px] font-semibold">Yillik Faoliyat</span>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
					{yillikFaoliyat.map((stat) => (
						<Card key={stat.label} className="py-0">
							<CardContent className="flex items-center justify-between px-4 py-3">
								<div className="flex items-center gap-3">
									<Icon icon={stat.icon} size={20} className="text-muted-foreground" />
									<span className="text-[12px] text-muted-foreground leading-tight">{stat.label}</span>
								</div>
								<span className={`text-[13px] font-bold px-2 py-0.5 rounded-full ${stat.badge}`}>{stat.value}</span>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* 6. Kafedra Statistikasi — katta, tablening ustida */}
			<div className="flex flex-col gap-3">
				<span className="text-[14px] font-semibold">Kafedra Statistikasi</span>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{kafedraStats.map((stat) => (
						<Card key={stat.label}>
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle>
									<span className="text-[13px] font-medium text-muted-foreground">{stat.label}</span>
								</CardTitle>
								<CardAction className={`${stat.bg} rounded-xl p-3 w-12 h-12 flex items-center justify-center`}>
									<Icon icon={stat.icon} size={24} color="white" />
								</CardAction>
							</CardHeader>
							<CardContent>
								<span className="text-[28px] font-bold">{stat.value.toLocaleString()}</span>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* 7. Eng faol bo'lim + Oxirgi faoliyat */}
			{/* 9. Kafedralar Haqida Umumiy Ma'lumot */}
			<div className="flex flex-col gap-3">
				<div className="flex flex-col gap-0.5">
					<span className="text-[14px] font-semibold">Kafedralar Haqida Umumiy Ma'lumot</span>
					<span className="text-[12px] text-muted-foreground">
						Har bir bo'lim uchun batafsil statistika, shu jumladan taqdimotlar va so'nggi faoliyat
					</span>
				</div>
				<DataTable data={kafedraTable} columns={kafedraColumns} />
			</div>

			{/* 10. Eng faol bo'lim + Oxirgi faoliyat */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{/* Eng faol bo'lim */}
				<Card className="border-0" style={{ backgroundColor: "#23B257" }}>
					<CardContent className="flex flex-col gap-2 px-6 py-5">
						<span className="text-[13px] font-medium text-white/70">Eng Faol Bo'lim</span>
						<span className="text-[18px] font-bold text-white">{engFaolBolim.nomi}</span>
						<span className="text-[13px] text-white/80">{engFaolBolim.taqdimotlar.toLocaleString()} taqdimnoma</span>
					</CardContent>
				</Card>

				{/* Oxirgi faoliyat */}
				<Card className="border-0" style={{ backgroundColor: "#3676F0" }}>
					<CardContent className="flex flex-col gap-2 px-6 py-5">
						<span className="text-[13px] font-medium text-white/70">Oxirgi Faoliyat</span>
						<span className="text-[18px] font-bold text-white">{oxirgiFailiyat.ism}</span>
						<span className="text-[13px] text-white/80">{oxirgiFailiyat.vaqt}</span>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
