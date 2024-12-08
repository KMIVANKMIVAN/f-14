import { usarRemoveParada } from "@/apis/administracion/apisParadas";
import { exitoToast } from "@/lib/notificaciones";
import refrescarAdminParadaStore from "@/store/administracion/refrescarAdminParada";
import { manejoError } from "@/utils/mostrarErrores";
import { TriangleAlert, X } from "lucide-react";

interface EliminarParadaProps {
  idColumna: number;
  dialogActCerrar: () => void;
}

export default function Eliminarparada({
  dialogActCerrar,
  idColumna,
}: EliminarParadaProps) {
  const { incrementar } = refrescarAdminParadaStore();
  const {
    mutate: deleteParada,
    data,
    isSuccess,
    error,
  } = usarRemoveParada(idColumna);

  async function accionEnviar() {
    deleteParada();
  }

  if (isSuccess) {
    exitoToast(`Se eliminó la parada: ${data.parada}`);
    dialogActCerrar(); // Cerrar el modal si la eliminación fue exitosa
    incrementar();
  }

  if (error) manejoError(error);

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
                ¿Estás Seguro de Eliminar?
              </h3>
            </div>
            <div className="py-8">
              <div className="flex justify-center gap-4">
                <button
                  className="w-32 px-4 py-2 border border-gray-300 text-gray-900 dark:text-white dark:hover:bg-gray-600 rounded-lg bg-transparent hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={dialogActCerrar}
                >
                  No
                </button>
                <button
                  className="w-32 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  onClick={accionEnviar}
                >
                  Sí
                </button>
              </div>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
