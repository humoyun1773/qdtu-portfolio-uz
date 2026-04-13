import Icon from "@/components/icon/icon";
import { Badge } from "@/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Separator } from "@/ui/separator";


// TODO: Replace with useQuery hooks
const teacher: {
	fullName: string;
	phone: string;
	position: string;
	degree: string;
	department: string;
	faculty: string;
	joinedYear: number;
} | null = null;

const stats: { label: string; value: number; icon: string; color: string; bg: string }[] = [];
const publications: { title: string; journal: string; year: number; type: string }[] = [];

const typeBadge: Record<string, string> = {
	Maqola: "bg-blue-100 text-blue-700",
	Patent: "bg-amber-100 text-amber-700",
	Konferensiya: "bg-emerald-100 text-emerald-700",
};

export default function TeacherDashboard() {
	if (!teacher) {
		return (
			<div className="flex flex-col gap-6 w-full">
				<Card>
					<CardContent className="flex items-center justify-center py-12 text-muted-foreground text-[14px]">
					<p className="text-muted-foreground animate-pulse text-sm font-medium">ma'lumotlar yuklanmoqda...</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 w-full">
			{/* Profile */}
			<Card>
				<CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-5 px-6 py-5">
					<div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
						<Icon icon="mdi:account" size={36} color="#1d4ed8" />
					</div>
					<div className="flex flex-col gap-1 flex-1">
						<h2 className="text-[18px] font-bold leading-tight">{teacher.fullName}</h2>
						<div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
							<span className="flex items-center gap-1">
								<Icon icon="lucide:phone" size={13} />
								{teacher.phone}
							</span>
							<span className="flex items-center gap-1">
								<Icon icon="lucide:briefcase" size={13} />
								{teacher.position}
							</span>
							<span className="flex items-center gap-1">
								<Icon icon="mdi:school-outline" size={13} />
								{teacher.degree}
							</span>
						</div>
						<div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted-foreground mt-0.5">
							<span className="flex items-center gap-1">
								<Icon icon="lucide:layers" size={13} />
								{teacher.department}
							</span>
							<span className="flex items-center gap-1">
								<Icon icon="lucide:building-2" size={13} />
								{teacher.faculty}
							</span>
						</div>
					</div>
					<Badge className="bg-green-100 text-green-700 border-0 text-[12px] px-3 py-1 shrink-0">
						Faol xodim
					</Badge>
				</CardContent>
			</Card>

			{/* Stats */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{stats.map((stat) => (
					<Card key={stat.label} className="py-0">
						<CardContent className={`flex flex-col items-center justify-center gap-2 px-4 py-5 text-center ${stat.bg} rounded-xl`}>
							<Icon icon={stat.icon} size={28} color={stat.color} />
							<span className="text-[26px] font-bold leading-tight">{stat.value}</span>
							<span className="text-[11px] text-muted-foreground leading-tight">{stat.label}</span>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Publications & Portfolio */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle>
							<span className="text-[14px] font-semibold">So'nggi Ilmiy Ishlar</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-0 p-0">
						{publications.map((pub, i) => (
							<div key={pub.title}>
								<div className="flex items-start justify-between gap-3 px-6 py-3">
									<div className="flex flex-col gap-0.5 flex-1 min-w-0">
										<span className="text-[13px] font-medium leading-snug line-clamp-2">{pub.title}</span>
										<span className="text-[11px] text-muted-foreground">
											{pub.journal} · {pub.year}
										</span>
									</div>
									<span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${typeBadge[pub.type] ?? ""}`}>
										{pub.type}
									</span>
								</div>
								{i < publications.length - 1 && <Separator />}
							</div>
						))}
						{publications.length === 0 && (
							<p className="text-center text-[13px] text-muted-foreground py-8">
								Ilmiy ishlar mavjud emas
							</p>
						)}
					</CardContent>
				</Card>

				<Card className="border-0" style={{ backgroundColor: "#3676F0" }}>
					<CardContent className="flex flex-col gap-1 px-6 py-5">
						<span className="text-[13px] text-white/70">Ishlash davri</span>
						<span className="text-[20px] font-bold text-white">
							{new Date().getFullYear() - teacher.joinedYear} yil — {teacher.joinedYear} yildan buyon
						</span>
						<span className="text-[13px] text-white/80">{teacher.department}</span>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
