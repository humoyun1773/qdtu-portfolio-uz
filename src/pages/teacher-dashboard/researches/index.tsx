import { Loader2, Plus, User, Sparkles, BookOpen } from "lucide-react";
import { useModalActions } from "@/store/modalStore";
import { useUser } from "@/hooks/user/useUser";
import { useResearch } from "@/hooks/teacher/useResearch";
import { Button } from "@/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { ResearchModal } from "@/pages/teachers/detail/detail-modals/research-modal";
import { ResearchesTab } from "@/pages/teachers/detail/detail-tabs/researches-tab";

export default function TeacherResearches() {
	const { open } = useModalActions();
	const { data: teacher, isLoading: userLoading } = useUser();
	const { data: researchData, isLoading: researchLoading } = useResearch(teacher?.id ?? 0);

	if (userLoading || researchLoading) {
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

	const hasData = (researchData?.data?.body?.length ?? 0) > 0;

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
					<Button onClick={() => open({ _type: "research" })} size="lg" className="group whitespace-nowrap px-6">
						<Plus className="mr-3 size-5 group-hover:rotate-90 transition-transform duration-300" />
						Yangi tadqiqot qo'shish
					</Button>
				</div>
			</div>

			<div>
				<div className="mb-6">
					<h2 className="text-2xl font-semibold flex items-center gap-3">
						<BookOpen className="size-7 text-blue-600" />
						Tadqiqotlar
					</h2>
					<p className="text-muted-foreground mt-1">O'qituvchining ilmiy tadqiqot ishlari va loyihalari</p>
				</div>

				<div className="bg-card border rounded-3xl shadow-sm overflow-hidden">
					<div className="p-6">
						{hasData ? (
							<ResearchesTab
								data={researchData?.data?.body as any}
								userId={teacher.id}
								page={0}
								totalPage={0}
								onPageChange={() => {}}
								isLoading={researchLoading}
							/>
						) : (
							<div className="py-28 flex flex-col items-center justify-center text-center">
								<div className="relative mb-8">
									<div className="absolute inset-0 animate-ping rounded-full bg-blue-500/20 scale-150" />
									<div className="relative size-28 rounded-3xl bg-muted/80 flex items-center justify-center border border-dashed border-blue-200">
										<Sparkles className="size-14 text-blue-500/40" />
									</div>
								</div>
								<h3 className="text-2xl font-semibold text-foreground mb-3">Hozircha tadqiqot yo'q</h3>
								<Button onClick={() => open({ _type: "research" })} size="lg" className="rounded-2xl">
									<Plus className="mr-2 size-5" />
									Tadqiqot qo'shish
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>

			<ResearchModal userId={teacher.id} />
		</div>
	);
}
