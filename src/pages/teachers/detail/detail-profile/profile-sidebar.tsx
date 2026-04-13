import { Flame, UserRound } from "lucide-react";
import { animate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ITeacherDetail } from "@/features/teacher/teacher.type";
import { Progress } from "@/ui/progress";

type ProfileSidebarProps = {
	profile: {
		fullName: string;
		lavozimName: string;
		imageUrl: string | null;
	};
	newImage?: string | File | null;
	/** Backend profile-completion foizi (0–100) */
	complation?: number | null;
	/** Maydonlar to'ldirilganligiga qarab taxminiy foiz (API sekin bo'lsa) */
	detail?: ITeacherDetail | null;
	/** Foizni refreshdan keyin saqlash / tiklash uchun foydalanuvchi id */
	cacheUserId?: number;
};

function clampPercent(n: number): number {
	if (!Number.isFinite(n)) return 0;
	return Math.min(100, Math.max(0, Math.round(n)));
}

/** API ba'zan raqam emas yoki { data: n } qaytarishi mumkin */
function parseApiCompletion(raw: unknown): number | undefined {
	if (raw == null) return undefined;
	if (typeof raw === "number" && Number.isFinite(raw)) return raw;
	if (typeof raw === "string") {
		const x = Number.parseFloat(raw);
		return Number.isFinite(x) ? x : undefined;
	}
	if (typeof raw === "object" && raw !== null && "data" in raw) {
		return parseApiCompletion((raw as { data: unknown }).data);
	}
	return undefined;
}

function estimateProfileCompleteness(detail: ITeacherDetail | undefined): number {
	if (!detail) return 0;
	const values = [
		detail.fullName,
		detail.phone,
		detail.email,
		detail.profession,
		detail.biography,
		detail.orcId,
		detail.scopusId,
		detail.scienceId,
		detail.researcherId,
		detail.input,
		detail.imageUrl,
		detail.fileUrl,
	];
	const filled = values.filter((v) => v != null && String(v).trim() !== "").length;
	return clampPercent((filled / values.length) * 100);
}

function completionCacheKey(userId: number) {
	return `profile-completion-pct-${userId}`;
}

function readCachedPercent(userId: number | undefined): number {
	if (userId == null || userId <= 0) return 0;
	try {
		const raw = sessionStorage.getItem(completionCacheKey(userId));
		if (raw == null) return 0;
		return clampPercent(JSON.parse(raw) as number);
	} catch {
		return 0;
	}
}

export function ProfileSidebar({ profile, newImage, complation, detail, cacheUserId }: ProfileSidebarProps) {
	const preview =
		newImage instanceof File
			? URL.createObjectURL(newImage)
			: typeof newImage === "string"
				? newImage
				: profile.imageUrl;

	const apiRaw = parseApiCompletion(complation);
	const apiPct = apiRaw !== undefined ? clampPercent(apiRaw) : undefined;
	const estPct = estimateProfileCompleteness(detail ?? undefined);

	let target = Math.max(apiPct ?? 0, estPct);
	target = clampPercent(target);

	if (target === 0 && cacheUserId != null && cacheUserId > 0 && apiPct === undefined && complation == null) {
		const cached = readCachedPercent(cacheUserId);
		if (cached > 0) target = cached;
	}

	const [displayed, setDisplayed] = useState(() => clampPercent(target));
	const fromRef = useRef(displayed);

	useEffect(() => {
		if (cacheUserId != null && cacheUserId > 0 && target > 0) {
			try {
				sessionStorage.setItem(completionCacheKey(cacheUserId), JSON.stringify(target));
			} catch {
				/* ignore */
			}
		}
	}, [target, cacheUserId]);

	useEffect(() => {
		const safeTarget = clampPercent(target);
		const from = clampPercent(fromRef.current);
		const c = animate(from, safeTarget, {
			duration: 0.85,
			ease: [0.22, 1, 0.36, 1],
			onUpdate: (latest) => {
				const v = clampPercent(latest);
				fromRef.current = v;
				setDisplayed(v);
			},
		});
		return () => c.stop();
	}, [target]);

	const percentage = clampPercent(displayed);

	return (
		<div className="w-full lg:w-72 lg:shrink-0 animate-in fade-in duration-500">
			<div className="group rounded-3xl border border-border/40 bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
				<div className="relative aspect-square w-full bg-muted overflow-hidden">
					{preview ? (
						<img
							src={preview}
							alt={profile.fullName}
							className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center text-muted-foreground/20">
							<UserRound className="size-20" strokeWidth={1} />
						</div>
					)}

					<div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent dark:from-foreground/80 dark:via-foreground/30 dark:to-transparent" />

					<div className="absolute bottom-4 left-4 right-4 text-white dark:text-foreground">
						<h2 className="text-[15px] font-bold leading-tight line-clamp-1">{profile.fullName}</h2>
						<p className="text-[11px] text-white/80 dark:text-muted-foreground font-medium mt-0.5">
							{profile.lavozimName}
						</p>
					</div>
				</div>

				<div className="p-5 space-y-4">
					<div className="flex items-center justify-between gap-2">
						<div className="space-y-0.5">
							<p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.05em]">
								Profil Natijasi
							</p>
							<div className="flex items-center gap-1.5">
								<span className="text-xl font-black text-foreground tabular-nums">{percentage}%</span>
								{percentage > 0 && <Flame className="size-4 text-orange-500 fill-orange-500" />}
							</div>
						</div>

						<div
							className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shadow-sm border ${
								percentage > 80
									? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800"
									: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800"
							}`}
						>
							{percentage === 100 ? "To'liq" : percentage > 50 ? "Yaxshi" : "Tugallanmagan"}
						</div>
					</div>

					<div className="space-y-2">
						<Progress value={percentage} className="h-2 bg-muted transition-all duration-700 ease-out" />
						<p className="text-[11px] text-muted-foreground leading-snug">
							{percentage < 100
								? "Profilingizni 100% ga yetkazib, ko'proq imkoniyatlarga ega bo'ling."
								: "Ajoyib natija! Ma'lumotlaringiz to'liq."}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
