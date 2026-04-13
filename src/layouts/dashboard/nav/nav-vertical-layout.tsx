import { Icon } from "@/components/icon";
import { NavMini, NavVertical } from "@/components/nav";
import type { NavProps } from "@/components/nav/types";
import { GLOBAL_CONFIG } from "@/global-config";
import { useSettingActions, useSettings } from "@/store/settingStore";
import { ThemeLayout } from "@/types/enum";
import { Button } from "@/ui/button";
import { ScrollArea } from "@/ui/scroll-area";
import { cn } from "@/utils";
import qdtuLogo from "@/assets/images/qdtu.png";

type Props = {
	data: NavProps["data"];
	className?: string;
};

export function NavVerticalLayout({ data, className }: Props) {
	const settings = useSettings();
	const { themeLayout } = settings;
	const { setSettings } = useSettingActions();

	const navWidth = themeLayout === ThemeLayout.Vertical ? "var(--layout-nav-width)" : "var(--layout-nav-width-mini)";
	const handleToggle = () => {
		setSettings({
			...settings,
			themeLayout: themeLayout === ThemeLayout.Mini ? ThemeLayout.Vertical : ThemeLayout.Mini,
		});
	};
	return (
		<nav
			data-slot="slash-layout-nav"
			className={cn(
				"fixed inset-y-0 left-0 flex-col h-full bg-background dark:bg-[#141414] border-r border-dashed dark:border-[#8C8C8C] z-nav transition-[width] duration-300 ease-in-out",
				className,
			)}
			style={{
				width: navWidth,
			}}
		>
			<div
				className={cn("relative flex items-center justify-center py-4 px-2 h-[var(--layout-header-height)] ", {
					"justify-center": themeLayout === ThemeLayout.Mini,
				})}
			>
				<div className="flex items-center justify-center gap-2 overflow-">
					<img
						src={qdtuLogo}
						alt="QDTU"
						className="shrink-0 rounded"
						style={{ width: 32, height: 32, objectFit: "contain" }}
					/>
					<span
						className="text-xl font-bold transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap"
						style={{
							opacity: themeLayout === ThemeLayout.Mini ? 0 : 1,
							maxWidth: themeLayout === ThemeLayout.Mini ? 0 : "160px",
						}}
					>
						{GLOBAL_CONFIG.appName}
					</span>
				</div>

				<Button
					variant="outline"
					size="icon"
					onClick={handleToggle}
					className="h-7 w-7 absolute right-0 rounded-full translate-x-1/2 dark:bg-[#141414] dark:border-[#8C8C8C]"
				>
					{themeLayout === ThemeLayout.Mini ? (
						<Icon icon="lucide:arrow-right-to-line" size={12} />
					) : (
						<Icon icon="lucide:arrow-left-to-line" size={12} />
					)}
				</Button>
			</div>

			<ScrollArea className={cn("h-[calc(100vh-var(--layout-header-height))] px-2 bg-background dark:bg-[#141414]")}>
				{themeLayout === ThemeLayout.Mini ? <NavMini data={data} /> : <NavVertical data={data} />}
			</ScrollArea>
		</nav>
	);
}
