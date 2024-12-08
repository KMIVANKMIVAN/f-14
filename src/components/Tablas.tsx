"use client";
import { Search, Filter, Ellipsis } from "lucide-react";
import DialogGeneral from "./DialogCrear";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

interface TablaProps {
  columnas: { id: string; label: string }[];
  respuesta: { [key: string]: any }[];
  accionCompo: string;
}

export default function Tablas({
  columnas,
  respuesta,
  accionCompo,
}: TablaProps) {
  return (
    <div>
      <div className="mx-auto ">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Buscar"
                  />
                </div>
              </form>
            </div>
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <DialogGeneral accionCompo={accionCompo} />
                <Select>
                  <SelectTrigger className="w-full md:w-auto flex items-center justify-center">
                    <Filter className="h-4 w-4 mr-2 text-gray-400" />
                    Filtros
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className=" text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {columnas.map((col) => (
                    <th key={col.id} scope="col" className="px-4 py-3">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {respuesta.map((row, rowIndex) => (
                  <tr className="border-b dark:border-gray-700" key={rowIndex}>
                    {columnas.map((col) => (
                      <td key={col.id} className="px-4 py-3">
                        {col.id === "id" ? (
                          <th
                            scope="row"
                            className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {row[col.id]}
                          </th>
                        ) : col.id === "acciones" ? (
                          <td className="px-4 py-3 flex items-center justify-end">
                            <div className="flex items-center space-x-3 w-10">
                              <Select>
                                <SelectTrigger className="w-[180px] ">
                                  <Ellipsis className="w-5 h-5" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="light">Light</SelectItem>
                                  <SelectItem value="dark">Dark</SelectItem>
                                  <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div
                              id="apple-imac-27-dropdown"
                              className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                            >
                              <ul
                                className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                aria-labelledby="apple-imac-27-dropdown-button"
                              >
                                <li>
                                  <a
                                    href="#"
                                    className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                  >
                                    Show
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href="#"
                                    className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                  >
                                    Edit
                                  </a>
                                </li>
                              </ul>
                              <div className="py-1">
                                <a
                                  href="#"
                                  className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                >
                                  Delete
                                </a>
                              </div>
                            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
