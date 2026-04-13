import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fileService } from "@/features/file/file.service";
import { TeacherService } from "@/features/teacher/teacher.service";
import type { ProfileFormData, UpdateProfileRequestBody } from "@/features/teacher/teacher.type";

function extractUploadedUrl(body: unknown): string | undefined {
	if (typeof body === "string" && body.trim() !== "") return body;
	if (body && typeof body === "object") {
		const o = body as Record<string, unknown>;
		if (typeof o.data === "string" && o.data.trim() !== "") return o.data;
		if (typeof o.url === "string") return o.url;
		if (typeof o.fileUrl === "string") return o.fileUrl;
		if (typeof o.imageUrl === "string") return o.imageUrl;
	}
	return undefined;
}

export type UpdateProfileMutationResult = {
	nextImageUrl?: string;
	nextFileUrl?: string;
};

export function useUpdateProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: ProfileFormData): Promise<UpdateProfileMutationResult> => {
			const payload: UpdateProfileRequestBody = {
				id: input.id,
			};

			let nextImageUrl: string | undefined;
			let nextFileUrl: string | undefined;

			if (input.imageUri instanceof File) {
				const raw = await fileService.uploadImage(input.imageUri);
				nextImageUrl = extractUploadedUrl(raw);
				if (nextImageUrl) payload.imageUrl = nextImageUrl;
			} else if (typeof input.imageUri === "string" && input.imageUri.trim() !== "") {
				payload.imageUrl = input.imageUri;
			}

			if (input.fileUrl instanceof File) {
				const raw = await fileService.uploadFile(input.fileUrl);
				nextFileUrl = extractUploadedUrl(raw);
				if (nextFileUrl) payload.fileUrl = nextFileUrl;
			} else if (typeof input.fileUrl === "string" && input.fileUrl.trim() !== "") {
				payload.fileUrl = input.fileUrl;
			}

			if (input.fullName !== undefined) payload.fullName = input.fullName;
			if (input.phoneNumber !== undefined) payload.phoneNumber = input.phoneNumber;
			if (input.email !== undefined) payload.email = input.email;
			if (input.biography !== undefined) payload.biography = input.biography;
			if (input.input !== undefined) payload.input = input.input;
			if (input.age !== undefined) payload.age = input.age;
			if (input.orcid !== undefined) payload.orcId = input.orcid;
			if (input.scopusid !== undefined) payload.scopusId = input.scopusid;
			if (input.scienceId !== undefined) payload.scienceId = input.scienceId;
			if (input.researcherId !== undefined) payload.researcherId = input.researcherId;
			if (input.gender !== undefined) payload.gender = input.gender;
			if (input.profession !== undefined) payload.profession = input.profession;
			if (input.lavozmId !== undefined) payload.lavozmId = input.lavozmId;
			if (input.departmentId !== undefined) payload.departmentId = input.departmentId;

			await TeacherService.updateProfile(payload);
			return { nextImageUrl, nextFileUrl };
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["teachers"] });
			queryClient.invalidateQueries({
				queryKey: ["teacher", "detail", variables.id],
				exact: true,
			});
			queryClient.invalidateQueries({
				queryKey: ["teacher-completion", variables.id],
				exact: true,
			});
		},
		onError: (error: unknown) => {
			console.error("Profile update error:", error);
		},
	});
}
