
import { create } from "zustand";

interface DialogState {
  cerrarDialogCrear: boolean; 
  setCerrarDialogCrear: (value: boolean) => void; 
}

const useAbrirDialogCrearStore = create<DialogState>((set) => ({
  cerrarDialogCrear: false,  
  setCerrarDialogCrear: (value: boolean) => set({ cerrarDialogCrear: value }),
}));

export default useAbrirDialogCrearStore;
