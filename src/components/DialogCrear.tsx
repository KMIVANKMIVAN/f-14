"use client";

import { Button } from "./ui/button";
import { Plus, X } from "lucide-react";
import CrearUsuario from "./administracion/usuarios/CrearUsuario";
import CrearRol from "./administracion/roles/CrearRol";
import useAbrirDialogCrearStore from "@/store/administracion/botonDialogCrear";
import CrearGrupo from "./administracion/grupos/CrearGrupo";

interface DialogGeneralProps {
  accionCompo: string;
}

export default function DialogCrear({ accionCompo }: DialogGeneralProps) {
  const { cerrarDialogCrear, setCerrarDialogCrear } =
    useAbrirDialogCrearStore();
  const renderizarContenido = () => {
    switch (accionCompo) {
      case "usuarios":
        return <CrearUsuario />;
      case "roles":
        return <CrearRol />;
      case "grupos":
        return <CrearGrupo />;
      default:
        return null;
    }
  };
  const dialogCerrar = () => {
    setCerrarDialogCrear(false);
  };
  return (
    <div>
      <Button
        variant="flat5"
        className="w-full md:w-auto flex items-center justify-center"
        onClick={() => setCerrarDialogCrear(true)}
      >
        <Plus className="h-3.5 w-3.5 mr-2" />
        Crear
      </Button>
      {cerrarDialogCrear && (
        <div
          id="modal-overlay"
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={dialogCerrar}
        >
          <div
            id="static-modal"
            tabIndex={-1}
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="px-4 md:px-0 relative py-2 w-full max-w-xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700 overflow-y-auto"
              style={{ maxHeight: "90vh" }}
            >
              <div className="flex items-center justify-between  md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Crear
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => {
                    dialogCerrar();
                  }}
                >
                  <X />
                </button>
              </div>
              <div className="py-7">{renderizarContenido()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
