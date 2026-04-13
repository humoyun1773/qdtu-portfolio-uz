import { ChevronRight, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { TableToolbar } from "@/components/table-toolbar/table-toolbar";
import type { ProfileFormData, Teacher } from "@/features/teacher/teacher.type";
import { useGetTeacherStats } from "@/hooks/teacher/useGetTeacherStats";
import { useMaslahat } from "@/hooks/teacher/useMaslahat";
import { useMukofot } from "@/hooks/teacher/useMukofot";
import { useNashr } from "@/hooks/teacher/useNashr";
import { useNazorat } from "@/hooks/teacher/useNazorat";
import { useResearch } from "@/hooks/teacher/useResearch";
import { useTeacherComplation } from "@/hooks/teacher/useTeacherComplation";
import { useTeacherId } from "@/hooks/teacher/useTeacherId";
import { useModalActions } from "@/store/modalStore";
import { Button } from "@/ui/button";
import { ActivityTabs } from "./activity-tabs";
import { MaslahatModal } from "./detail-modals/maslahat-modal";
import { MukofotModal } from "./detail-modals/mukofot-modal";
import { NashrModal } from "./detail-modals/nashr-modal";
import { PublicationModal } from "./detail-modals/publication-modal";
import { ResearchModal } from "./detail-modals/research-modal";
import { ProfileForm } from "./detail-profile/profile-form";
import { ProfileSidebar } from "./detail-profile/profile-sidebar";
import { StatsGrid } from "./stats-grid";


const EmptyState = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
	<div className="flex flex-col items-center justify-center py-8 gap-3">
		<div className="text-muted-foreground">{icon}</div>
		<div className="text-center">
			<p className="font-semibold text-foreground text-sm">{title}</p>
			<p className="text-xs text-muted-foreground mt-1">{description}</p>
		</div>
	</div>
);

export default function TeacherDetail() {
	const navigate = useNavigate();
	const location = useLocation();
	const { open } = useModalActions();

	// Teacher ma'lumotlarini olish
	const teacher = (location.state as { teacher?: Teacher } | null)?.teacher ?? null;
	const { data: teacherResponse } = useTeacherId(teacher?.id);
	const teacherDetail = teacherResponse?.data;

	const { data: statsData, isLoading: statsLoading } = useGetTeacherStats(teacher?.id);
	const { data: researchData, isLoading: researchLoading } = useResearch(teacher?.id ?? 0);
	const { data: nazoratData, isLoading: nazoratLoading } = useNazorat(teacher?.id ?? 0);
	const { data: nashrData, isLoading: nashrLoading } = useNashr(teacher?.id ?? 0);
	const { data: maslahatData, isLoading: maslahatLoading } = useMaslahat(teacher?.id ?? 0);
	const { data: mukofotData } = useMukofot(teacher?.id ?? 0);
	const { data: complation } = useTeacherComplation(teacher?.id);

	const research = researchData?.data;
	const nazorat = nazoratData?.data;
	const nashr = nashrData?.data;
	const maslahat = maslahatData?.data;
	const mukofot = mukofotData?.data;

	useEffect(() => {
		if (teacher) {
			document.title = `QDTU | ${teacher.fullName}`;
		}
	}, [teacher]);

	const [activeTab, setActiveTab] = useState("researches");

	if (!teacher) {
		return (
			<div className="flex flex-col items-center justify-center h-64 gap-3">
				<EmptyState
					title="O'qituvchi topilmadi"
					description="Ro'yxatga qaytib, o'qituvchini tanlang"
					icon={<GraduationCap className="size-5 text-muted-foreground" />}
				/>
				<Button variant="outline" size="sm" onClick={() => navigate("/teachers")}>
					Ro'yxatga qaytish
				</Button>
			</div>
		);
	}

	const formSyncKey =
		teacherDetail != null
			? [
					teacher.id,
					teacherDetail.orcId ?? "",
					teacherDetail.scopusId ?? "",
					teacherDetail.scienceId ?? "",
					teacherDetail.researcherId ?? "",
					teacherDetail.fullName ?? "",
					teacherDetail.email ?? "",
					teacherDetail.biography ?? "",
					teacherDetail.input ?? "",
					teacherDetail.phone ?? "",
					teacherDetail.imageUrl ?? "",
					teacherDetail.fileUrl ?? "",
				].join("|")
			: String(teacher.id);

	const profile: ProfileFormData = {
		id: teacher.id,
		fullName: teacherDetail?.fullName ?? teacher.fullName,
		email: teacherDetail?.email ?? teacher.email ?? "",
		age: teacherDetail?.age ?? teacher.age ?? 0,
		phoneNumber: teacherDetail?.phone ?? teacher.phoneNumber,
		biography: teacherDetail?.biography ?? "",
		input: teacherDetail?.input ?? "",
		orcid: teacherDetail?.orcId ?? "",
		scopusid: teacherDetail?.scopusId ?? "",
		scienceId: teacherDetail?.scienceId ?? "",
		researcherId: teacherDetail?.researcherId ?? "",
		gender: teacherDetail?.gender ?? teacher.gender,
		profession: teacherDetail?.profession ?? teacher.profession ?? "",
		imageUri: teacherDetail?.imageUrl ?? null,
		fileUrl: teacherDetail?.fileUrl ?? null,
	};

	const TOOLBAR_CONFIG = {
		researches: {
			addLabel: "Tadqiqot qo'shish",
			countLabel: "Tadqiqotlar",
			count: research?.totalElements,
			modalType: "research",
		},
		publications: {
			addLabel: "Nazorat qo'shish",
			countLabel: "Nazoratlar",
			count: nazorat?.totalElements,
			modalType: "nazorat",
		},
		supervision: {
			addLabel: "Nashr qo'shish",
			countLabel: "Nashrlar",
			count: nashr?.totalElements,
			modalType: "nashr",
		},
		activities: {
			addLabel: "Maslahat qo'shish",
			countLabel: "Maslahatlar",
			count: maslahat?.totalElements,
			modalType: "maslahat",
		},
		awards: {
			addLabel: "Mukofot qo'shish",
			countLabel: "Mukofotlar",
			count: mukofot?.totalElements,
			modalType: "mukofot",
		},
	} as const;

	const currentToolbar = TOOLBAR_CONFIG[activeTab as keyof typeof TOOLBAR_CONFIG];
	if (researchLoading) {
		return <div className="flex flex-col gap-4 sm:gap-5">
			<p className="text-muted-foreground animate-pulse text-sm font-medium">ma'lumotlar yuklanmoqda...</p>
			</div>;
	}
	
	return (
		<div className="flex flex-col gap-4 sm:gap-5">
			{/* Breadcrumb */}
			<div className="flex items-center gap-1.5 text-sm text-muted-foreground">
				<button
					type="button"
					onClick={() => navigate("/teachers")}
					className="hover:text-foreground transition-colors hover:underline underline-offset-4"
				>
					O'qituvchilar
				</button>
				<ChevronRight className="size-3.5 opacity-40" />
				<span className="text-foreground font-medium truncate max-w-xs sm:max-w-lg">{teacher.fullName}</span>
			</div>
			<div className="flex flex-col lg:flex-row gap-4 sm:gap-5 items-start">
				<ProfileSidebar
					key={teacher.id}
					cacheUserId={teacher.id}
					profile={{
						fullName: teacherDetail?.fullName || teacher.fullName,
						lavozimName: teacher.lavozim,
						imageUrl: teacherDetail?.imageUrl || teacher.imgUrl,
					}}
					newImage={teacher.imgUrl}
					complation={complation?.data}
					detail={teacherDetail}
				/>
				<div className="w-full lg:flex-1 min-w-0">
					<ProfileForm defaultValues={profile} formSyncKey={formSyncKey} />
				</div>
			</div>
			<TableToolbar
				addLabel={currentToolbar.addLabel}
				countLabel={currentToolbar.countLabel}
				count={currentToolbar.count}
				searchValue=""
				onSearchChange={() => {}}
				showSearch={false}
				onAdd={currentToolbar.modalType ? () => open({ _type: currentToolbar.modalType }) : undefined}
			/>
			<ActivityTabs
				activeTab={activeTab}
				onTabChange={setActiveTab}
				userId={teacher?.id ?? 0}
				// Research
				researches={research?.body ?? []}
				researchPage={research?.page ?? 0}
				researchTotalPage={research?.totalPage ?? 0}
				onResearchPageChange={() => {}}
				researchLoading={researchLoading ?? false}
				// Nashr
				nashrlar={nashr?.body ? (Array.isArray(nashr.body) ? nashr.body : [nashr.body]) : []}
				nashrlarPage={nashr?.page ?? 0}
				nashrlarTotalPage={nashr?.totalPage ?? 0}
				onNashrlarPageChange={() => {}}
				nashrlarLoading={nashrLoading ?? false}
				// Nazorat
				nazoratlar={nazorat?.body ? (Array.isArray(nazorat.body) ? nazorat.body : [nazorat.body]) : []}
				nazoratPage={nazorat?.page ?? 0}
				nazoratTotalPage={nazorat?.totalPage ?? 0}
				onNazoratPageChange={() => {}}
				nazoratLoading={nazoratLoading ?? false}
				// Maslahat
				maslahatlar={maslahat?.body ? (Array.isArray(maslahat.body) ? maslahat.body : [maslahat.body]) : []}
				maslahatlarPage={maslahat?.page ?? 0}
				maslahatlarTotalPage={maslahat?.totalPage ?? 0}
				onMaslahatlarPageChange={() => {}}
				maslahatlarLoading={maslahatLoading ?? false}
				// Mukofot
				mukofotlar={mukofot?.body ? (Array.isArray(mukofot.body) ? mukofot.body : [mukofot.body]) : []}
			/>
			<StatsGrid data={statsData} isLoading={statsLoading} />
			{/* Modallar */}
			<ResearchModal userId={teacher?.id} />
			<PublicationModal userId={teacher?.id} />
			<NashrModal userId={teacher?.id} />
			<MaslahatModal userId={teacher?.id} />
			<MukofotModal userId={teacher?.id} />
		</div>
	);
}
