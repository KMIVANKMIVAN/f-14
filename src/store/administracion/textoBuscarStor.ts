import { create } from "zustand";

type Store = {
  textoBuscarRolStory: string;
  setTextoBuscarRolStory: (texto: string) => void;
  eliminarTextoBuscarRolStory: () => void;

  textoBuscarGrupoStory: string;
  setTextoBuscarGrupoStory: (texto: string) => void;
  eliminarTextoBuscarGrupoStory: () => void;

  textoBuscarUsuarioStory: string;
  setTextoBuscarUsuarioStory: (texto: string) => void;
  eliminarTextoBuscarUsuarioStory: () => void;
};

const useStoreTextoBuscar = create<Store>((set) => ({
  textoBuscarRolStory: "",
  textoBuscarGrupoStory: "",
  textoBuscarUsuarioStory: "",

  setTextoBuscarRolStory: (texto) => set(() => ({ textoBuscarRolStory: texto })),
  eliminarTextoBuscarRolStory: () => set(() => ({ textoBuscarRolStory: "" })),

  setTextoBuscarGrupoStory: (texto) => set(() => ({ textoBuscarGrupoStory: texto })),
  eliminarTextoBuscarGrupoStory: () => set(() => ({ textoBuscarGrupoStory: "" })),

  setTextoBuscarUsuarioStory: (texto) =>
    set(() => ({ textoBuscarUsuarioStory: texto })),
  eliminarTextoBuscarUsuarioStory: () =>
    set(() => ({ textoBuscarUsuarioStory: "" })),
}));

export default useStoreTextoBuscar;
