import "./line-loading.css";
import { useSettings } from "@/store/settingStore";
import { commonColors, paletteColors } from "@/theme/tokens/color";

export function LineLoading() {
	const { themeMode } = useSettings();

	const isLight = themeMode === "light";

	return (
		<div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-4">
			<div
				className="relative h-2 w-80 overflow-hidden rounded-full shadow-inner"
				style={{
					backgroundColor: isLight ? paletteColors.gray["200"] : paletteColors.gray["700"],
				}}
			>
				<div
					className="absolute left-0 top-0 h-full w-2/5 animate-loading rounded-full"
					style={{
						background: isLight
							? `linear-gradient(90deg, ${commonColors.black}00, ${commonColors.black})`
							: `linear-gradient(90deg, ${commonColors.white}00, ${commonColors.white})`,
					}}
				/>
			</div>
			<p
				className="text-sm font-medium tracking-widest uppercase opacity-60"
				style={{
					color: isLight ? commonColors.black : commonColors.white,
				}}
			>
				Loading...
			</p>
		</div>
	);
}