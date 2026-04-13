import { create } from "zustand";

type ModalStore = {
	isOpen: boolean;
	editData: any | null; // null = add mode, object = edit mode
	open: (data?: any) => void;
	close: () => void;
};

const useModalStore = create<ModalStore>((set) => ({
	isOpen: false,
	editData: null,
	open: (data = null) => set({ isOpen: true, editData: data }),
	close: () => set({ isOpen: false, editData: null }),
}));

export const useModalIsOpen = () => useModalStore((s) => s.isOpen);
export const useModalEditData = () => useModalStore((s) => s.editData);
export const useModalActions = () => useModalStore((s) => ({ open: s.open, close: s.close }));

export default useModalStore;
