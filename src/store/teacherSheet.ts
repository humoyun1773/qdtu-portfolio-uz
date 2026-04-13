import { create } from "zustand";

type Teacher = {
	id: number;
	name: string;
	faculty: string;
	department: string;
	position: string;
	email: string;
};

type TeacherSheetStore = {
	isOpen: boolean;
	editData: Teacher | null;
	open: (data?: Teacher | null) => void;
	close: () => void;
};

const useTeacherSheetStore = create<TeacherSheetStore>((set) => ({
	isOpen: false,
	editData: null,
	open: (data = null) => set({ isOpen: true, editData: data ?? null }),
	close: () => set({ isOpen: false, editData: null }),
}));

export const useTeacherSheetIsOpen = () => useTeacherSheetStore((s) => s.isOpen);
export const useTeacherSheetEditData = () => useTeacherSheetStore((s) => s.editData);
export const useTeacherSheetActions = () => useTeacherSheetStore((s) => ({ open: s.open, close: s.close }));

export default useTeacherSheetStore;
