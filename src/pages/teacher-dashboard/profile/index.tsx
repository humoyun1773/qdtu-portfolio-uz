import { useTeacherComplation } from "@/hooks/teacher/useTeacherComplation";
import { useTeacherId } from "@/hooks/teacher/useTeacherId";
import { useUser } from "@/hooks/user/useUser";
import type { ProfileFormData } from "@/features/teacher/teacher.type";
import { ProfileForm } from "@/pages/teachers/detail/detail-profile/profile-form";
import { ProfileSidebar } from "@/pages/teachers/detail/detail-profile/profile-sidebar";
import { Loader2 } from "lucide-react";

export default function TeacherProfile() {
	const { data: teacher, isLoading } = useUser();
	const { data: profile, isLoading: teacherLoading } = useTeacherId(teacher?.id);
	const { data: complation, isLoading: ComplationLoading } = useTeacherComplation(teacher?.id);	

	if (teacherLoading || isLoading || ComplationLoading)
		return (
			<div className="w-full h-[60vh] flex flex-col items-center justify-center gap-3 animate-in fade-in duration-500">
				<Loader2 className="size-10 text-primary animate-spin" />
				<p className="text-muted-foreground animate-pulse text-sm font-medium">ma'lumotlar yuklanmoqda...</p>
			</div>
		);
	const formSyncKey = profile?.data
		? [
				profile.data.id,
				profile.data.orcId ?? "",
				profile.data.scopusId ?? "",
				profile.data.scienceId ?? "",
				profile.data.researcherId ?? "",
				profile.data.fullName ?? "",
				profile.data.email ?? "",
				profile.data.biography ?? "",
				profile.data.input ?? "",
				profile.data.phone ?? "",
				profile.data.imageUrl ?? "",
				profile.data.fileUrl ?? "",
			].join("|")
		: "";

	const profileFormValues: ProfileFormData | undefined = profile?.data
		? {
				id: profile.data.id,
				fullName: profile.data.fullName ?? "",
				email: profile.data.email ?? "",
				age: profile.data.age ?? 0,
				phoneNumber: profile.data.phone ?? "",
				biography: profile.data.biography ?? "",
				input: profile.data.input ?? "",
				orcid: profile.data.orcId ?? "",
				scopusid: profile.data.scopusId ?? "",
				scienceId: profile.data.scienceId ?? "",
				researcherId: profile.data.researcherId ?? "",
				gender: profile.data.gender ?? true,
				profession: profile.data.profession ?? "",
				imageUri: profile.data.imageUrl ?? null,
				fileUrl: profile.data.fileUrl ?? null,
			}
		: undefined;

	return (
		<div className="flex flex-col lg:flex-row gap-4 sm:gap-5 items-start">
			{profile?.data ? (
				<ProfileSidebar
					key={profile.data.id}
					cacheUserId={profile.data.id}
					profile={{
						fullName: profile.data.fullName ?? "",
						lavozimName: profile.data.profession ?? "",
						imageUrl: profile.data.imageUrl ?? null,
					}}
					complation={complation?.data}
					detail={profile.data}
				/>
			) : null}
			<div className="w-full lg:flex-1 min-w-0">
				{profileFormValues ? (
					<ProfileForm defaultValues={profileFormValues} formSyncKey={formSyncKey} />
				) : null}
			</div>
		</div>
	);
}
