"use client";
import { useEffect } from "react";
import useStoreTextoBuscar from "@/store/administracion/textoBuscarStor";
import Cargando from "@/components/Cargando";
import TablasAdmin from "../TablasAdmin";
import { manejoError } from "@/utils/mostrarErrores";
import { columnasGrupos } from "../utils/estructuraDatos";
import { usarGetfindAllGrupos } from "@/apis/administracion/apisGrupos";

export default function Grupo() {
  const {
    textoBuscarGrupoStory,
    eliminarTextoBuscarUsuarioStory,
    eliminarTextoBuscarRolStory,
    eliminarTextoBuscarGrupoStory,
  } = useStoreTextoBuscar();

  const { data, isLoading, error, isSuccess } = usarGetfindAllGrupos(
    textoBuscarGrupoStory
  );

  useEffect(() => {
    if (isSuccess) {
      eliminarTextoBuscarUsuarioStory();
      eliminarTextoBuscarRolStory();
    }
  }, [isSuccess, eliminarTextoBuscarUsuarioStory, eliminarTextoBuscarRolStory]);

  if (isLoading) return <Cargando />;
  if (error) {
    manejoError(error),
      eliminarTextoBuscarUsuarioStory(),
      eliminarTextoBuscarRolStory();
    eliminarTextoBuscarGrupoStory();
  }

  return (
    <div>
      <TablasAdmin
        columnas={columnasGrupos}
        respuesta={data ?? []}
        accionCompo={"grupos"}
      />
    </div>
  );
}
