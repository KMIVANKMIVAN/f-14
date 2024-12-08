"use client";

import ActualizarRol from "./roles/ActualizarRol";
import ActualizarUsuario from "./usuarios/ActualizarUsuario";
import { TriangleAlert, X } from "lucide-react";
import EliminarUsuario from "./usuarios/EliminarUsuario";
import Alta from "./usuarios/Alta";
import RestablecerContra from "./usuarios/RestablecerContra";
import EliminarRol from "./roles/EliminarRol";
import EliminarGrupo from "./grupos/EliminarGrupo";

import Baja from "./usuarios/Baja";
import ActualizarGrupo from "./grupos/ActualizarGrupo";

interface DialogGeneralProps {
  idColumna: number;
  accionCompo: string;
  respuestaActualizar: { [key: string]: any };
  dialogActCerrar: () => void;
  elimiResetAltaBaja: string;
}

const componenteMapa: {
  [key: string]: { [key: string]: React.FC<any> };
} = {
  usuarios: {
    eliminar: EliminarUsuario,
    "dar baja": Baja,
    "dar alta": Alta,
    "recetear contraseña": RestablecerContra,
    default: ActualizarUsuario,
  },
  roles: {
    eliminar: EliminarRol,
    default: ActualizarRol,
  },
  grupos: {
    eliminar: EliminarGrupo,
    default: ActualizarGrupo,
  },
};

export default function DialogActualizar({
  idColumna,
  accionCompo,
  respuestaActualizar,
  dialogActCerrar,
  elimiResetAltaBaja,
}: DialogGeneralProps) {
  const ComponenteSeleccionado =
    componenteMapa[accionCompo]?.[elimiResetAltaBaja] ||
    componenteMapa[accionCompo]?.default ||
    null;

  return (
    <div>
      <div
        id="modal-overlay"
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={dialogActCerrar}
      >
        <div
          id="static-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="capitalize px-4 md:px-0 relative py-2 w-full max-w-xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700 overflow-y-auto border-t-4 border-red-500"
            style={{ maxHeight: "90vh" }}
          >
            <div className="flex justify-between items-center md:p-5  rounded-t dark:border-gray-600 relative">
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <TriangleAlert className="text-red-500 w-8 h-8" />
              </div>

              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white ml-auto"
                onClick={dialogActCerrar}
              >
                <X />
              </button>
            </div>
            <div className="flex items-center justify-center border-b ">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">
                ¿Estás Seguro de {elimiResetAltaBaja}?
              </h3>
            </div>
            <div className="py-8">
              {ComponenteSeleccionado && (
                <ComponenteSeleccionado
                  idColumna={idColumna}
                  respuestaActualizar={respuestaActualizar}
                  dialogActCerrar={dialogActCerrar}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
