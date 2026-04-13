import { cn } from "@/utils";
import { FileSpreadsheet, FileText, FileType2, ImagePlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type BaseProps = {
	value: File | string | null;
	onChange: (file: File | string | null) => void;
	className?: string;
};

type ImageInputProps = BaseProps & { type: "image" };

type DocumentInputProps = BaseProps & {
	type: "document";
	/** default: ".pdf,.doc,.docx,.xls,.xlsx" */
	accept?: string;
};

export type FileInputProps = ImageInputProps | DocumentInputProps;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getDocIcon(name: string) {
	const ext = name.split(".").pop()?.toLowerCase();
	if (ext === "pdf") return <FileType2 className="size-8 text-red-500" />;
	if (ext === "xls" || ext === "xlsx") return <FileSpreadsheet className="size-8 text-green-600" />;
	return <FileText className="size-8 text-blue-600" />;
}

function fileNameFromUrl(url: string): string {
	try {
		const u = new URL(url, typeof window !== "undefined" ? window.location.origin : "http://local");
		const last = u.pathname.split("/").pop() ?? "hujjat";
		return decodeURIComponent(last) || "hujjat";
	} catch {
		const last = url.split("/").pop() ?? "hujjat";
		return last.split("?")[0] || "hujjat";
	}
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FileInput(props: FileInputProps) {
	const { value, onChange, className } = props;
	const inputRef = useRef<HTMLInputElement>(null);
	const [objectUrl, setObjectUrl] = useState<string | null>(null);

	const accept = props.type === "image" ? "image/*" : (props.accept ?? ".pdf,.doc,.docx,.xls,.xlsx");

	useEffect(() => {
		if (value instanceof File) {
			const url = URL.createObjectURL(value);
			setObjectUrl(url);
			return () => {
				URL.revokeObjectURL(url);
				setObjectUrl(null);
			};
		}
		setObjectUrl(null);
		return undefined;
	}, [value]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] ?? null;
		onChange(file);
	};

	const handleRemove = (e: React.MouseEvent) => {
		e.stopPropagation();
		onChange(null);
		if (inputRef.current) inputRef.current.value = "";
	};

	// ── Image variant ──────────────────────────────────────────────────────────
	if (props.type === "image") {
		const preview =
			value instanceof File ? objectUrl : typeof value === "string" && value ? value : null;

		return (
			<div className={cn("flex flex-col gap-1", className)}>
				<button
					type="button"
					onClick={() => inputRef.current?.click()}
					className="relative w-full h-36 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 flex flex-col items-center justify-center gap-2 transition-colors bg-muted/20 cursor-pointer"
				>
					{preview ? (
						<>
							<img src={preview} alt="preview" className="w-full h-full object-cover rounded-xl" />
							<button
								type="button"
								onClick={handleRemove}
								className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70"
							>
								<X className="size-3.5" />
							</button>
						</>
					) : (
						<>
							<ImagePlus className="size-8 text-muted-foreground/40" />
							<span className="text-[13px] text-muted-foreground">Rasm yuklash uchun bosing</span>
						</>
					)}
				</button>
				<input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
			</div>
		);
	}

	// ── Document variant ───────────────────────────────────────────────────────
	const docLabel = value instanceof File ? value.name : typeof value === "string" ? fileNameFromUrl(value) : "";

	return (
		<div className={cn("flex flex-col gap-1", className)}>
			{value ? (
				<div className="flex flex-col gap-2 w-full min-h-36 rounded-xl border px-4 py-3 bg-muted/20 justify-center">
					<div className="flex items-center gap-3">
						{value instanceof File ? (
							<>
								{getDocIcon(value.name)}
								<div className="flex flex-col gap-0.5 flex-1 min-w-0">
									<span className="text-[13px] font-medium truncate">{value.name}</span>
									<span className="text-[11px] text-muted-foreground">{formatBytes(value.size)}</span>
								</div>
							</>
						) : (
							<>
								{getDocIcon(docLabel)}
								<div className="flex flex-col gap-0.5 flex-1 min-w-0">
									<a
										href={value}
										target="_blank"
										rel="noopener noreferrer"
										className="text-[13px] font-medium text-primary hover:underline truncate"
									>
										{docLabel}
									</a>
									<span className="text-[11px] text-muted-foreground">Yuklangan fayl</span>
								</div>
							</>
						)}
						<button
							type="button"
							onClick={handleRemove}
							className="shrink-0 text-muted-foreground hover:text-red-500 transition-colors"
						>
							<X className="size-4" />
						</button>
					</div>
				</div>
			) : (
				<button
					type="button"
					onClick={() => inputRef.current?.click()}
					className="w-full h-36 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 flex flex-col items-center justify-center gap-1.5 transition-colors bg-muted/20 cursor-pointer"
				>
					<FileText className="size-6 text-muted-foreground/40" />
					<span className="text-[13px] text-muted-foreground">PDF, Word yoki Excel yuklang</span>
					<span className="text-[11px] text-muted-foreground/60">{accept}</span>
				</button>
			)}
			<input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
		</div>
	);
}
