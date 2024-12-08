"use client";
import { useState } from "react";
import Cargando from "@/components/Cargando";
import { manejoError } from "@/utils/mostrarErrores";
import { columnasParadas } from "../utils/estructuraDatos";
import { Ellipsis, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { usarGetfindAllParadas } from "@/apis/administracion/apisParadas";
import ActualizarParada from "./ActualizarParada";
import Eliminarparada from "./Eliminarparada";
import { DatosParada } from "@/interface/funcionalidades/interfasParadas";

export default function Paradas() {
  const [textoBuscar, setTextoBuscar] = useState<string | "">(""); // Valor del input de búsqueda
  const [consulta, activarConsulta] = useState<string | "">(""); // Para almacenar el texto de búsqueda
  const [paradaSeleccionada, setParadaSeleccionada] = useState<any>(null); // Estado para almacenar la parada seleccionada
  const [paradaAEliminar, setParadaAEliminar] = useState<any>(null); // Para almacenar la parada a eliminar
  const [mostrarModalEliminar, setMostrarModalEliminar] =
    useState<boolean>(false); // Estado para controlar el modal de eliminación
  // const [desSeleccionar, setDesSeleccionar] = useState<string | null>(null);
  const [desSeleccionar, setDesSeleccionar] = useState<string | undefined>(
    undefined
  );

  const {
    data: datafindAllParadas,
    isLoading: isLoadingfindAllParadas,
    error: errorFindAllParadas,
  } = usarGetfindAllParadas(consulta);

  const manejarEntradaCambiar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextoBuscar(e.target.value);
  };

  const manejarBuscar = () => {
    activarConsulta(textoBuscar);
  };

  if (isLoadingfindAllParadas) return <Cargando />;
  if (errorFindAllParadas) manejoError(errorFindAllParadas);

  const manejarAccion = (accion: string, row: any) => {
    if (accion === "actualizar") {
      setParadaSeleccionada(row); // Establece la parada seleccionada
    } else if (accion === "eliminar") {
      setParadaAEliminar(row); // Establece la parada a eliminar
      setMostrarModalEliminar(true); // Mostrar el modal de eliminación
    }
    setTimeout(() => {
      setDesSeleccionar(undefined);
    }, 100);
  };

  return (
    <div>
      <div className="mx-auto ">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">
              <div className="flex items-center">
                <div className="relative w-full">
                  <div
                    className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
                    onClick={manejarBuscar}
                  >
                    <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    value={textoBuscar}
                    onChange={manejarEntradaCambiar}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Buscar"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            {datafindAllParadas && (
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-auto">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    {columnasParadas.map((col) => (
                      <th
                        key={col.id}
                        scope="col"
                        className="px-4 py-3 whitespace-nowrap"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {datafindAllParadas.map((row, rowIndex) => (
                    <tr
                      className="border-b dark:border-gray-700"
                      key={rowIndex}
                    >
                      {columnasParadas.map((col) => (
                        <td
                          key={col.id}
                          className="px-4 py-3 whitespace-nowrap"
                        >
                          {col.id === "id" ? (
                            <th
                              scope="row"
                              className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                              {row[col.id]}
                              {/* {row[col.id as keyof DatosParada]} */}
                            </th>
                          ) : col.id === "acciones" ? (
                            <td className="px-4 py-3 flex items-center justify-end">
                              <Select
                                value={desSeleccionar}
                                onValueChange={(valor) =>
                                  manejarAccion(valor, row)
                                }
                              >
                                <SelectTrigger className="w-full md:w-auto flex items-center justify-center">
                                  <Ellipsis className="h-4 w-4 mr-2 text-gray-400" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="eliminar">
                                    Eliminar
                                  </SelectItem>
                                  <SelectItem value="actualizar">
                                    Actualizar
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                          ) : (
                            row[col.id]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {paradaSeleccionada && (
        <ActualizarParada
          key={paradaSeleccionada.id} // Cambia la key según el id de la parada
          respuestaActualizar={paradaSeleccionada}
          idColumna={paradaSeleccionada.id}
        />
      )}
      {mostrarModalEliminar && paradaAEliminar && (
        <Eliminarparada
          idColumna={paradaAEliminar.id}
          dialogActCerrar={() => setMostrarModalEliminar(false)} // Cerrar el modal después de la acción
        />
      )}
    </div>
  );
}
