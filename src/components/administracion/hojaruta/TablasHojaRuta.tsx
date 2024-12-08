"use client";

import DialogCrear from "../../DialogCrear";
import BuscarAdmin from "../BuscarAdmin";
import Opciones from "../Opciones";

interface TablasAdminProps {
  columnas: { id: string; label: string }[];
  respuesta: { [key: string]: any }[];
  accionCompo: string;
}

export default function TablasHojaRuta({
  columnas,
  respuesta,
  accionCompo,
}: TablasAdminProps) {
  return (
    <div>
      <div className="mx-auto ">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <BuscarAdmin accionCompo={accionCompo} />
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <DialogCrear accionCompo={accionCompo} />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            {respuesta && (
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-auto">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    {columnas.map((col) => (
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
                  {respuesta.map((row, rowIndex) => (
                    <tr
                      className="border-b dark:border-gray-700"
                      key={rowIndex}
                    >
                      {columnas.map((col) => (
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
                            </th>
                          ) : col.id === "acciones" ? (
                            <td className="px-4 py-3 flex items-center justify-end">
                              <Opciones
                                idColumna={row.id}
                                accionCompo={accionCompo}
                                respuestaActualizar={row}
                              />
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
    </div>
  );
}
