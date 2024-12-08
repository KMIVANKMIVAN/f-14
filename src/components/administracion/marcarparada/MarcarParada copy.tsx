"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dayjs from "dayjs";
import { Calendar, Filter, Search } from "lucide-react";
import { useState } from "react";
import { columnasMarcarParadas } from "../utils/estructuraDatos";
import { usarGetMarcarParadasPorRangoYGrupo } from "@/apis/administracion/apisMarcarParada";
import { DatosMarcarParada } from "@/interface/administracion/interfasMarcarParada";
import { usarGetGrupos } from "@/apis/administracion/apisGrupos";
import { exitoToast } from "@/lib/notificaciones";
import Cargando from "@/components/Cargando";
import { manejoError, manejoErrorMarcarParada } from "@/utils/mostrarErrores";
import pdfMake from "pdfmake/build/pdfmake"; // Importa pdfmake
import pdfFonts from "pdfmake/build/vfs_fonts"; // Importa los fonts para pdfmake
pdfMake.vfs = pdfFonts.pdfMake.vfs; // Configura las fuentes

type ColumnId = keyof DatosMarcarParada;

export default function MarcarParada() {
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string | null>(
    null
  );
  const [introducirValor, setIntroducirValor] = useState("");
  const [startDate, setStartDate] = useState<string | null>(
    dayjs().format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState<string | null>(
    dayjs().format("YYYY-MM-DD")
  );
  const [buscar, setBuscar] = useState(false); // Nuevo estado para controlar la búsqueda

  const { data, isLoading, error } = usarGetMarcarParadasPorRangoYGrupo(
    buscar ? startDate || "" : "",
    buscar ? endDate || "" : "",
    buscar ? Number(grupoSeleccionado) : null,
    buscar ? introducirValor : "" // Solo pasa el valor si la búsqueda está activa
  );

  const {
    data: grupos,
    isLoading: gruposLoading,
    error: gruposError,
  } = usarGetGrupos();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIntroducirValor(event.target.value);
  };

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const formatDate = (date: string | null) => {
    return date ? dayjs(date).format("YYYY-MM-DD") : "";
  };

  const handleSelectGroup = (value: string) => {
    setGrupoSeleccionado(value);
  };

  const handleSearchClick = () => {
    // Verifica si el grupo y las fechas son válidos
    if (grupoSeleccionado && startDate && endDate) {
      setBuscar(true); // Activa la búsqueda
      // La consulta se ejecuta automáticamente debido al uso del hook
    } else {
      manejoErrorMarcarParada(
        "Por favor, selecciona un grupo y establece un rango de fechas."
      );
    }
  };
  const handleGeneratePDF = () => {
    if (!data || data.length === 0) {
      manejoErrorMarcarParada("No hay datos disponibles para generar el PDF.");
      return;
    }

    // Filtra las columnas para eliminar cualquier columna vacía y la columna "ID"
    const columnasFiltradas = columnasMarcarParadas.filter((col) => {
      return (
        col.label !== "ID" && // Asegúrate de que "ID" no esté incluida
        data.some(
          (row) =>
            row[col.id as ColumnId] !== undefined &&
            row[col.id as ColumnId] !== null &&
            row[col.id as ColumnId] !== ""
        )
      );
    });

    const documentDefinition = {
      content: [
        {
          text: "Reporte de Llegada a las Paradas",
          style: "header",
          alignment: "center", // Centrando el texto
        },
        {
          style: "tableExample",
          table: {
            widths: ["auto", ...columnasFiltradas.map(() => "auto")], // Ajusta el ancho al contenido
            body: [
              [
                { text: "No.", style: "tableHeader" }, // Encabezado de contador
                ...columnasFiltradas.map((col) => ({
                  text: col.label.toUpperCase(), // Convertir a mayúsculas
                  style: "tableHeader",
                })),
              ], // Encabezados de la tabla
              ...data.map((row, index) => [
                { text: String(index + 1), style: "tableCell" }, // Contador
                ...columnasFiltradas.map((col) => ({
                  text: String(
                    row[col.id as ColumnId] !== undefined
                      ? row[col.id as ColumnId]
                      : ""
                  ), // Manejo de undefined
                  style: "tableCell",
                })),
              ]),
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10], // Margen: [izquierda, arriba, derecha, abajo]
        },
        tableHeader: {
          fontSize: 7, // Tamaño de letra para encabezados
          bold: true,
          fillColor: "#CCCCCC",
          alignment: "center",
          margin: [0, 5],
        },
        tableCell: {
          fontSize: 6, // Tamaño de letra para contenido de las celdas
          margin: [5, 5], // Margen interno de la celda
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
      },
    };

    console.log("Document Definition:", documentDefinition); // Para verificar
    pdfMake.createPdf(documentDefinition).open(); // Genera y abre el PDF
  };

  if (isLoading) return <Cargando />;
  if (error) manejoError(error);
  if (gruposLoading) return <Cargando />;
  if (gruposError) manejoError(gruposError);

  return (
    <div className="mx-auto ">
      <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
          <div className="w-full md:w-1/2">
            <div className="flex items-center">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer">
                  <Search
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    onClick={handleSearchClick}
                  />
                </div>
                <input
                  type="text"
                  id="simple-search"
                  value={introducirValor}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Buscar por CI o Placa"
                />
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <div
                id="date-range-picker"
                date-rangepicker
                className="flex items-center"
              >
                <span className="mx-4 text-gray-500">de</span>

                <div className="relative">
                  <input
                    type="date"
                    id="datepicker-range-start"
                    value={formatDate(startDate)}
                    onChange={handleStartDateChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Fecha de inicio"
                  />
                </div>
                <span className="mx-4 text-gray-500">a</span>
                <div className="relative">
                  <input
                    type="date"
                    id="datepicker-range-end"
                    value={formatDate(endDate)}
                    onChange={handleEndDateChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Fecha de fin"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <Select onValueChange={handleSelectGroup}>
                <SelectTrigger className="w-full md:w-auto flex items-center justify-center">
                  <Filter className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Seleccionar Grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Grupos:</SelectLabel>
                    {grupos && grupos.length > 0 ? (
                      grupos.map((grupo) => (
                        <SelectItem key={grupo.id} value={grupo.id.toString()}>
                          {grupo.grupo}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-grupos" disabled>
                        No hay grupos disponibles
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          {data && (
            <>
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-auto">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    {columnasMarcarParadas.map((col) => (
                      <th key={col.id} className="px-6 py-3">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr
                      key={index}
                      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      {columnasMarcarParadas.map((col) => (
                        <td key={col.id} className="px-6 py-4">
                          {row[col.id as ColumnId]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={handleGeneratePDF}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
              >
                Generar PDF
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
