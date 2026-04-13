import { cn } from "@/utils";
import { Award, FileText, FlaskConical, TrendingUp, Users } from "lucide-react";
import { Skeleton } from "@/ui/skeleton";
import type { TeacherStatsData } from "@/features/teacher/teacher.type";

type StatsCardProps = {
	icon: React.ReactNode;
	label: string;
	value: number;
	sub: string;
	iconBg: string;
	iconColor: string;
	valueColor: string;
	isLoading?: boolean;
};

function StatsCard({ icon, label, value, sub, iconBg, iconColor, valueColor, isLoading }: StatsCardProps) {
	return (
		<div className="rounded-2xl border border-border/50 bg-background p-4 flex flex-col gap-3 hover:border-border transition-colors duration-200">
			<div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
				<div className={cn("size-6 flex justify-center items-center", iconColor)}>{icon}</div>
			</div>

			<div className="flex flex-col gap-0.5">
				{isLoading ? (
					<Skeleton className="h-7 w-14 mb-1" />
				) : (
					<p className={cn("text-2xl font-bold tracking-tight", valueColor)}>{value}</p>
				)}
				<p className="text-[12px] font-medium text-muted-foreground">{label}</p>
			</div>

			<p className="text-[11px] text-muted-foreground border-t border-border/40 pt-2.5 truncate">
				{sub}
			</p>
		</div>
	);
}

type StatsGridProps = {
	data: TeacherStatsData | undefined;
	isLoading?: boolean;
};

export function StatsGrid({ data, isLoading }: StatsGridProps) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
			<StatsCard
				icon={<FlaskConical />}
				label="Tadqiqotlar"
				value={data?.tadqiqotlar ?? 0}
				sub={`${data?.maqolalar ?? 0} maqola`}
				iconBg="bg-blue-50 dark:bg-blue-950/50"
				iconColor="text-blue-600 dark:text-blue-400"
				valueColor="text-blue-600 dark:text-blue-400"
				isLoading={isLoading}
			/>
			<StatsCard
				icon={<Users />}
				label="Nazoratlar"
				value={data?.nazorat ?? 0}
				sub={`${data?.maslahatlar ?? 0} maslahat`}
				iconBg="bg-violet-50 dark:bg-violet-950/50"
				iconColor="text-violet-600 dark:text-violet-400"
				valueColor="text-violet-600 dark:text-violet-400"
				isLoading={isLoading}
			/>
			<StatsCard
				icon={<FileText />}
				label="Nashrlar"
				value={data?.nashrlar ?? 0}
				sub={`${data?.kitoblar ?? 0} kitob`}
				iconBg="bg-emerald-50 dark:bg-emerald-950/50"
				iconColor="text-emerald-600 dark:text-emerald-400"
				valueColor="text-emerald-600 dark:text-emerald-400"
				isLoading={isLoading}
			/>
			<StatsCard
				icon={<TrendingUp />}
				label="Maslahatlar"
				value={data?.maslahatlar ?? 0}
				sub={`${data?.treninglar ?? 0} trening`}
				iconBg="bg-amber-50 dark:bg-amber-950/50"
				iconColor="text-amber-600 dark:text-amber-400"
				valueColor="text-amber-600 dark:text-amber-400"
				isLoading={isLoading}
			/>
			<StatsCard
				icon={<Award />}
				label="Mukofotlar"
				value={data?.mukofotlar ?? 0}
				sub="Respublika va xalqaro"
				iconBg="bg-rose-50 dark:bg-rose-950/50"
				iconColor="text-rose-600 dark:text-rose-400"
				valueColor="text-rose-600 dark:text-rose-400"
				isLoading={isLoading}
			/>
		</div>
	);
}