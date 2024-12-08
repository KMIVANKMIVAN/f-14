import { create } from "zustand";

interface DialogState {
  cerrarDialogActualiAdmin: boolean; 
  setCerrarDialogActualiAdmin: (value: boolean) => void; 
}

const useAbrirDialogActualiAdminStore = create<DialogState>((set) => ({
  cerrarDialogActualiAdmin: false, 
  setCerrarDialogActualiAdmin: (value: boolean) => set({ cerrarDialogActualiAdmin: value }),
}));

export default useAbrirDialogActualiAdminStore;
