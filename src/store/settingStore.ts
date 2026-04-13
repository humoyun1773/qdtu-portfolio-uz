import { ThemeColorPresets, ThemeLayout, ThemeMode } from "@/types/enum";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SettingsType = {
	themeMode: ThemeMode;
	themeLayout: ThemeLayout;
	themeColorPresets: ThemeColorPresets;
	themeStretch: boolean;
	breadCrumb: boolean;
	fontFamily: string;
	fontSize: number;
};

type SettingStore = {
	settings: SettingsType;
	actions: {
		setSettings: (settings: SettingsType) => void;
	};
};

const defaultSettings: SettingsType = {
	themeMode: ThemeMode.Light,
	themeLayout: ThemeLayout.Vertical,
	themeColorPresets: ThemeColorPresets.Cyan,
	themeStretch: false,
	breadCrumb: true,
	fontFamily: "Inter Variable, sans-serif",
	fontSize: 14,
};

const useSettingStore = create<SettingStore>()(
	persist(
		(set) => ({
			settings: defaultSettings,
			actions: {
				setSettings: (settings) => set({ settings }),
			},
		}),
		{ name: "settings", partialize: (state) => ({ settings: state.settings }) },
	),
);

export const useSettings = () => useSettingStore((state) => state.settings);
export const useSettingActions = () => useSettingStore((state) => state.actions);
