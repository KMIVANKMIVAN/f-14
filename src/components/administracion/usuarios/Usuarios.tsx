"use client";
import { useEffect } from "react";
import useStoreTextoBuscar from "@/store/administracion/textoBuscarStor";
import Cargando from "@/components/Cargando";
import TablasAdmin from "../TablasAdmin";
import { manejoError } from "@/utils/mostrarErrores";
import { usarGetUsuariosFindAllCI } from "@/apis/administracion/apisUsuarios";
import { columnasUsuarios } from "../utils/estructuraDatos";

export default function Usuarios() {
  const {
    textoBuscarUsuarioStory,
    eliminarTextoBuscarRolStory,
    eliminarTextoBuscarUsuarioStory,
  } = useStoreTextoBuscar();

  const { data, isLoading, error, isSuccess } = usarGetUsuariosFindAllCI(
    textoBuscarUsuarioStory
  );

  useEffect(() => {
    if (isSuccess) {
      eliminarTextoBuscarRolStory();
    }
  }, [isSuccess, eliminarTextoBuscarRolStory]);

  if (isLoading) return <Cargando />;
  if (error) {
    manejoError(error),
      eliminarTextoBuscarRolStory(),
      eliminarTextoBuscarUsuarioStory();
  }

  return (
    <div>
      <p className="mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-2xl dark:text-white">
        Administracion de Usuarios
      </p>
      <TablasAdmin
        columnas={columnasUsuarios}
        respuesta={data ?? []}
        accionCompo={"usuarios"}
      />
    </div>
  );
}
