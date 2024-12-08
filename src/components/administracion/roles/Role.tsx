"use client";
import { useEffect } from "react";
import useStoreTextoBuscar from "@/store/administracion/textoBuscarStor";
import Cargando from "@/components/Cargando";
import TablasAdmin from "../TablasAdmin";
import { manejoError } from "@/utils/mostrarErrores";
import { usarGetfindAllRoles } from "@/apis/administracion/apisRoles";
import { columnasRoles } from "../utils/estructuraDatos";

export default function Role() {
  const {
    textoBuscarRolStory,
    eliminarTextoBuscarUsuarioStory,
    eliminarTextoBuscarRolStory,
  } = useStoreTextoBuscar();

  const { data, isLoading, error, isSuccess } =
    usarGetfindAllRoles(textoBuscarRolStory);

  useEffect(() => {
    if (isSuccess) {
      eliminarTextoBuscarUsuarioStory();
    }
  }, [isSuccess, eliminarTextoBuscarUsuarioStory]);

  if (isLoading) <Cargando />;
  if (error) {
    manejoError(error),
      eliminarTextoBuscarUsuarioStory(),
      eliminarTextoBuscarRolStory();
  }

  return (
    <div>
      <TablasAdmin
        columnas={columnasRoles}
        respuesta={data ?? []}
        accionCompo={"roles"}
      />
    </div>
  );
}
