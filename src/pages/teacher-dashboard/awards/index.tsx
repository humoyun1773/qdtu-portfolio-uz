import { Award, Loader2, Plus, User } from "lucide-react";
import { useUser } from "@/hooks/user/useUser";
import { MukofotModal } from "@/pages/teachers/detail/detail-modals/mukofot-modal";
import { MukofotlarTab } from "@/pages/teachers/detail/detail-tabs/mukofotlar-tab";
import { useModalActions } from "@/store/modalStore";
import { Button } from "@/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { useMukofot } from "@/hooks/teacher/useMukofot";

export default function TeacherAwards() {
	const { open } = useModalActions();
	const { data: teacher, isLoading: userLoading } = useUser();
	const { data, isLoading: mukofotLoading } = useMukofot(teacher?.id ?? 0);

	if (userLoading || mukofotLoading) {
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
						<AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
							{teacher.fullName?.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 min-w-0">
						<h1 className="text-3xl font-bold tracking-tight text-foreground">{teacher.fullName}</h1>
						<p className="text-lg text-muted-foreground mt-1">
							{teacher.lavozim || teacher.position || "Lavozim mavjud emas"}
						</p>
					</div>
					<Button onClick={() => open({ _type: "mukofot" })} size="lg" className="group whitespace-nowrap px-6">
						<Plus className="mr-3 size-5 group-hover:rotate-90 transition-transform duration-300" />
						Mukofot qo'shish
					</Button>
				</div>
			</div>

			<div className="bg-card border rounded-3xl shadow-sm overflow-hidden p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-semibold flex items-center gap-3">
						<Award className="size-7 text-amber-600" />
						Mukofotlar
					</h2>
				</div>
				<MukofotlarTab
					isLoading={mukofotLoading}
					page={data?.data.page ?? 0}
					totalPage={data?.data.totalPage ?? 0}
					onPageChange={() => {}}
					userId={teacher.id}
					data={(data?.data.body ?? []) as any}
				/>
			</div>

			<MukofotModal userId={teacher.id} />
		</div>
	);
}
