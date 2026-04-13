import { useSettingActions, useSettings } from "@/store/settingStore";
import { Button } from "@/ui/button";
import { cn } from "@/utils";
import { Moon, Sun } from "lucide-react";
import type { ReactNode } from "react";
import { ThemeMode } from "#/enum";
import AccountDropdown from "../components/account-dropdown";
import BreadCrumb from "../components/bread-crumb";
import NoticeButton from "../components/notice";

interface HeaderProps {
	leftSlot?: ReactNode;
}

export default function Header({ leftSlot }: HeaderProps) {
	const settings = useSettings();
	const { breadCrumb, themeMode } = settings;
	const { setSettings } = useSettingActions();

	const toggleTheme = () => {
		setSettings({ ...settings, themeMode: themeMode === ThemeMode.Light ? ThemeMode.Dark : ThemeMode.Light });
	};
	return (
		<header
			data-slot="slash-layout-header"
			className={cn(
				"sticky top-0 left-0 right-0 z-30",
				"flex items-center justify-between px-2 grow-0 shrink-0",
				"bg-background/60 dark:bg-[#141414] backdrop-blur-xl",
				"h-[var(--layout-header-height)] ",
			)}
		>
			<div className="flex items-center">
				{leftSlot}
				<div className="hidden md:block ml-4">{breadCrumb && <BreadCrumb />}</div>
			</div>

			<div className="flex items-center gap-1">
				<Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
					{themeMode === ThemeMode.Dark ? <Sun size={20} /> : <Moon size={20} />}
				</Button>
				<NoticeButton />
				<AccountDropdown />
			</div>
		</header>
	);
}
