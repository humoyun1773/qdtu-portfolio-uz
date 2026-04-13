import CyanBlur from "@/assets/images/background/cyan-blur.png";
import RedBlur from "@/assets/images/background/red-blur.png";
import { Icon } from "@/components/icon";
import { type SettingsType, useSettingActions, useSettings } from "@/store/settingStore";
import { Button } from "@/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/ui/sheet";
import type { CSSProperties } from "react";

export default function SettingButton() {
	const settings = useSettings();
	const { setSettings } = useSettingActions();

	const updateSettings = (partialSettings: Partial<SettingsType>) => {
		setSettings({ ...settings, ...partialSettings });
	};

	const sheetContentBgStyle: CSSProperties = {
		backdropFilter: "blur(20px)",
		backgroundImage: `url("${CyanBlur}"), url("${RedBlur}")`,
		backgroundRepeat: "no-repeat, no-repeat",
		backgroundPosition: "right top, left bottom",
		backgroundSize: "50%, 50%",
	};

	return (
		<Sheet modal={false}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="rounded-full animate-slow-spin">
					<Icon icon="local:ic-setting" size={24} />
				</Button>
			</SheetTrigger>
			<SheetContent style={sheetContentBgStyle} className="gap-0" onOpenAutoFocus={(e) => e.preventDefault()}>
				<SheetHeader className="flex flex-row items-center justify-between px-6 py-4 shrink-0">
					<SheetTitle>Settings</SheetTitle>
					<SheetDescription />
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
}
