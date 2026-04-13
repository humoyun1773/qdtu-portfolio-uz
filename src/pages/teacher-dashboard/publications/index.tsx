import { useState } from "react";
import { Loader2, Plus, User, BookText, FileText } from "lucide-react";
import { useUser } from "@/hooks/user/useUser";
import { useNazorat } from "@/hooks/teacher/useNazorat";
import { useNashr } from "@/hooks/teacher/useNashr";
import { useModalActions } from "@/store/modalStore";
import { Button } from "@/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { PublicationModal } from "@/pages/teachers/detail/detail-modals/publication-modal";
import { NashrModal } from "@/pages/teachers/detail/detail-modals/nashr-modal";
import { NazoratTab } from "@/pages/teachers/detail/detail-tabs/nazorat-tab";
import { NashrlarTab } from "@/pages/teachers/detail/detail-tabs/nashrlar-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { cn } from "@/utils";

export default function TeacherPublications() {
	const { open } = useModalActions();
	const [activeTab, setActiveTab] = useState<"nazoratlar" | "nashrlar">("nazoratlar");
	const { data: teacher, isLoading: userLoading } = useUser();
	const { data: nazoratData, isLoading: nazoratLoading } = useNazorat(teacher?.id ?? 0);
	const { data: nashrData, isLoading: nashrLoading } = useNashr(teacher?.id ?? 0);

	if (userLoading || nazoratLoading || nashrLoading) {
		return (
			<div className="w-full h-[70vh] flex flex-col items-center justify-center gap-4">
				<Loader2 className="size-12 text-primary animate-spin" />
				<p className="text-muted-foreground text-base font-medium">Ma'lumotlar yuklanmoqda...</p>
			</div>
		);
	}

	if (!teacher) {
		return (
			<div className="flex flex-col items-center justify-center h-[60vh] text-center">
				<User className="size-20 text-muted-foreground mb-4" />
				<p className="text-xl font-medium">O'qituvchi topilmadi</p>
			</div>
		);
	}

	const counts = {
		nazoratlar: nazoratData?.data?.totalElements ?? 0,
		nashrlar: nashrData?.data?.totalElements ?? 0,
	};

	const config = {
		nazoratlar: { label: "Nazoratlar", modal: "nazorat" as const, icon: BookText },
		nashrlar: { label: "Nashrlar", modal: "nashr" as const, icon: FileText },
	};

	return (
		<div className="flex flex-col gap-8">
			<div className="bg-card border rounded-3xl p-6 shadow-sm">
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
					<Avatar className="size-24 border-4 border-white shadow-xl">
						<AvatarImage
							src={teacher.imgUrl || teacher.imageUrl || undefined}
							alt={teacher.fullName}
							className="object-cover"
						/>
						<AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
							{teacher.fullName?.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 min-w-0">
						<h1 className="text-3xl font-bold tracking-tight text-foreground">{teacher.fullName}</h1>
						<p className="text-lg text-muted-foreground mt-1">
							{teacher.lavozim || teacher.position || "Lavozim mavjud emas"}
						</p>
					</div>
					<Button
						onClick={() => open({ _type: config[activeTab].modal })}
						size="lg"
						className="group whitespace-nowrap px-6"
					>
						<Plus className="mr-3 size-5 group-hover:rotate-90 transition-transform duration-300" />
						{activeTab === "nazoratlar" ? "Nazorat qo'shish" : "Nashr qo'shish"}
					</Button>
				</div>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={(value) => setActiveTab(value as "nazoratlar" | "nashrlar")}
				className="w-full"
			>
				<TabsList className="bg-transparent h-auto p-0 gap-10 border-b border-border/60 w-full justify-start">
					{Object.entries(config).map(([key, item]) => {
						const isActive = activeTab === key;
						return (
							<TabsTrigger
								key={key}
								value={key}
								className={cn(
									"relative rounded-none border-0 bg-transparent px-1 py-4 text-base font-medium transition-all",
									"text-muted-foreground hover:text-foreground data-[state=active]:text-foreground",
									"after:absolute after:bottom-[-1px] after:left-0 after:h-[3px] after:w-full after:scale-x-0 after:bg-primary after:transition-transform",
									isActive && "after:scale-x-100",
								)}
							>
								<div className="flex items-center gap-3">
									<item.icon className="size-5" />
									<span>{item.label}</span>
									<span
										className={cn(
											"ml-2 flex h-6 min-w-[24px] items-center justify-center rounded-full px-2 text-xs font-bold",
											isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground",
										)}
									>
										{counts[key as keyof typeof counts]}
									</span>
								</div>
							</TabsTrigger>
						);
					})}
				</TabsList>

				<div className="mt-6">
					<TabsContent value="nazoratlar" className="m-0 focus-visible:outline-none">
						<div className="bg-card border rounded-3xl shadow-sm overflow-hidden p-6">
							<NazoratTab
								data={(nazoratData?.data?.body ?? []) as any}
								userId={teacher.id}
								page={0}
								totalPage={0}
								onPageChange={() => {}}
								isLoading={nazoratLoading}
							/>
						</div>
					</TabsContent>
					<TabsContent value="nashrlar" className="m-0 focus-visible:outline-none">
						<div className="bg-card border rounded-3xl shadow-sm overflow-hidden p-6">
							<NashrlarTab
								data={(nashrData?.data?.body ?? []) as any}
								userId={teacher.id}
								page={0}
								totalPage={0}
								onPageChange={() => {}}
								isLoading={nashrLoading}
							/>
						</div>
					</TabsContent>
				</div>
			</Tabs>

			<PublicationModal userId={teacher.id} />
			<NashrModal userId={teacher.id} />
		</div>
	);
}
