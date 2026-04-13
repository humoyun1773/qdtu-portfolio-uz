import { BookText, FlaskConical, Star, TrendingUp, Users } from "lucide-react";
import type { NazoratItem } from "@/features/nazorat/nazorat.type";
import type { PublicationItem } from "@/features/publication/publication.type";
import type { ResearchItem } from "@/features/research/research.type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { cn } from "@/utils";
import { MaslahatTab } from "./detail-tabs/maslahat-tab";
import type { Mukofot } from "./detail-tabs/mukofotlar-tab";
import { MukofotlarTab } from "./detail-tabs/mukofotlar-tab";
import { NashrlarTab } from "./detail-tabs/nashrlar-tab";
import { NazoratTab } from "./detail-tabs/nazorat-tab";
import { ResearchesTab } from "./detail-tabs/researches-tab";

const TABS = [
	{
		value: "researches",
		label: "Tadqiqotlar",
		icon: FlaskConical,
		activeClass: "text-violet-600 dark:text-violet-400 border-violet-500",
		stripClass: "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400",
	},
	{
		value: "publications",
		label: "Nazoratlar",
		icon: BookText,
		activeClass: "text-blue-600 dark:text-blue-400 border-blue-500",
		stripClass: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
	},
	{
		value: "supervision",
		label: "Nashrlar",
		icon: Users,
		activeClass: "text-emerald-600 dark:text-emerald-400 border-emerald-500",
		stripClass: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
	},
	{
		value: "activities",
		label: "Maslahat",
		icon: TrendingUp,
		activeClass: "text-amber-600 dark:text-amber-400 border-amber-500",
		stripClass: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
	},
	{
		value: "awards",
		label: "Mukofotlar",
		icon: Star,
		activeClass: "text-rose-600 dark:text-rose-400 border-rose-500",
		stripClass: "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400",
	},
] as const;

type ActivityTabsProps = {
	activeTab: string;
	onTabChange: (tab: string) => void;
	researches: ResearchItem[];
	researchPage: number;
	researchTotalPage: number;
	onResearchPageChange: (page: number) => void;
	researchLoading?: boolean;
	nazoratlar: NazoratItem[];
	nazoratPage: number;
	nazoratTotalPage: number;
	onNazoratPageChange: (page: number) => void;
	nazoratLoading?: boolean;
	nashrlar: PublicationItem[];
	nashrlarPage: number;
	nashrlarTotalPage: number;
	onNashrlarPageChange: (page: number) => void;
	nashrlarLoading?: boolean;
	maslahatlar: unknown[];
	maslahatlarPage: number;
	maslahatlarTotalPage: number;
	onMaslahatlarPageChange: (page: number) => void;
	maslahatlarLoading?: boolean;
	mukofotlar: unknown[];
	userId: number;
};

export function ActivityTabs({
	activeTab,
	onTabChange,
	researches,
	researchPage,
	researchTotalPage,
	onResearchPageChange,
	researchLoading,
	nazoratlar,
	nazoratPage,
	nazoratTotalPage,
	onNazoratPageChange,
	nazoratLoading,
	nashrlar,
	nashrlarPage,
	nashrlarTotalPage,
	onNashrlarPageChange,
	nashrlarLoading,
	maslahatlar,
	maslahatlarPage,
	maslahatlarTotalPage,
	onMaslahatlarPageChange,
	maslahatlarLoading,
	mukofotlar,
	userId,
}: ActivityTabsProps) {
	const activeConfig = TABS.find((t) => t.value === activeTab);

	return (
		<div className="rounded-2xl border border-border/50 bg-background shadow-sm overflow-hidden">
			<Tabs value={activeTab} onValueChange={onTabChange} className="gap-0 w-full">
				{/* Tab list */}
				<div className="border-b border-border/50 bg-muted/30 overflow-x-auto">
					<TabsList className="bg-transparent h-auto p-2 rounded-none gap-1 w-max sm:w-full flex justify-start">
						{TABS.map(({ value, label, icon: Icon, activeClass }) => {
							const isActive = activeTab === value;
							return (
								<TabsTrigger
									key={value}
									value={value}
									className={cn(
										"relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12.5px] font-medium whitespace-nowrap transition-all duration-150",
										"text-muted-foreground hover:text-foreground hover:bg-background/70",
										"data-[state=active]:shadow-none border border-transparent",
										isActive && "bg-background border-border/50",
									)}
								>
									<Icon
										className={cn(
											"size-3.5 shrink-0 transition-colors",
											isActive ? activeClass.split(" ")[0] : "text-muted-foreground/60",
										)}
									/>
									<span className={cn(isActive ? "font-semibold text-foreground" : "")}>{label}</span>
									{isActive && (
										<span
											className={cn(
												"absolute -bottom-px left-1/2 -translate-x-1/2 h-0.5 w-3/4 rounded-full",
												activeClass.split(" ")[0].replace("text-", "bg-"),
											)}
										/>
									)}
								</TabsTrigger>
							);
						})}
					</TabsList>
				</div>

				{/* Active strip */}
				{activeConfig && (
					<div
						className={cn(
							"flex items-center gap-2 px-5 py-2 border-b border-border/40 text-[12px] font-medium",
							activeConfig.stripClass,
						)}
					>
						<activeConfig.icon className="size-3.5" />
						<span>{activeConfig.label}</span>
					</div>
				)}

				{/* Content */}
				<div className="px-3 sm:px-5">
					<TabsContent value="researches">
						<div className="py-4 overflow-x-auto">
							<ResearchesTab
								data={researches as any}
								page={researchPage}
								totalPage={researchTotalPage}
								onPageChange={onResearchPageChange}
								isLoading={researchLoading ?? false}
							/>
						</div>
					</TabsContent>

					<TabsContent value="publications">
						<div className="py-4 overflow-x-auto">
							<NazoratTab
								data={nazoratlar as any}
								userId={userId ?? 0}
								page={nazoratPage}
								totalPage={nazoratTotalPage}
								onPageChange={onNazoratPageChange}
								isLoading={nazoratLoading ?? false}
							/>
						</div>
					</TabsContent>

					<TabsContent value="supervision">
						<div className="py-4 overflow-x-auto">
							<NashrlarTab
								data={nashrlar as any}
								userId={userId ?? 0}
								page={nashrlarPage}
								totalPage={nashrlarTotalPage}
								onPageChange={onNashrlarPageChange}
								isLoading={nashrlarLoading ?? false}
							/>
						</div>
					</TabsContent>

					<TabsContent value="activities">
						<div className="py-4 overflow-x-auto">
							<MaslahatTab
								data={maslahatlar as any}
								userId={userId ?? 0}
								page={maslahatlarPage}
								totalPage={maslahatlarTotalPage}
								onPageChange={onMaslahatlarPageChange}
								isLoading={maslahatlarLoading ?? false}
							/>
						</div>
					</TabsContent>

					<TabsContent value="awards">
						<div className="py-4 overflow-x-auto">
							<MukofotlarTab
								data={mukofotlar as any}
								userId={userId}
								page={0}
								totalPage={0}
								onPageChange={() => {}}
								isLoading={false}
							/>
						</div>
					</TabsContent>
				</div>
			</Tabs>
		</div>
	);
}
