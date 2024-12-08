import { usarRemoveGrupo } from "@/apis/administracion/apisGrupos";
import { exitoToast } from "@/lib/notificaciones";
import useAbrirDialogStore from "@/store/administracion/botonDialogActuali";
import useStoreTextoBuscar from "@/store/administracion/textoBuscarStor";

import { manejoError } from "@/utils/mostrarErrores";
interface EliminarGrupoProps {
  idColumna: number;
  dialogActCerrar: () => void;
}

export default function EliminarGrupo({
  dialogActCerrar,
  idColumna,
}: EliminarGrupoProps) {
  const { setCerrarDialogActualiAdmin } = useAbrirDialogStore();
  const { setTextoBuscarGrupoStory } = useStoreTextoBuscar();
  const {
    mutate: deleteGrupo,
    isSuccess,
    error,
    data: grupoEliminado,
  } = usarRemoveGrupo(idColumna);

  async function accionEnviar() {
    deleteGrupo();
  }

  if (isSuccess) {
    setTextoBuscarGrupoStory("");
    exitoToast(`Se elimino el grupo: ${grupoEliminado.grupo}`);
    setCerrarDialogActualiAdmin(true);
  }

  if (error) manejoError(error);
  return (
    <div>
      <div className="flex justify-center  gap-4">
        <button
          className="w-32 px-4 py-2 border border-gray-300 text-gray-900 dark:text-white dark:hover:bg-gray-600 rounded-lg bg-transparent hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={() => {
            dialogActCerrar();
          }}
        >
          No
        </button>
        <button
          className="w-32 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={() => {
            accionEnviar();
          }}
        >
          Sí
        </button>
      </div>
    </div>
  );
}
