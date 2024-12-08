import { create } from "zustand";


type Store = {
  contadorRefrescar: number
  incrementar: () => void
}

const refrescarAdminParadaStore = create<Store>()((set) => ({
  contadorRefrescar: 1,
  incrementar: () => set((state) => ({ contadorRefrescar: state.contadorRefrescar + 1 })),
}))
export default refrescarAdminParadaStore;
