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
import { Calendar, FileText, Filter, Search } from "lucide-react";
import { useState } from "react";
import { columnasAsistencias } from "../utils/estructuraDatos";

import { DatosAsistencia } from "@/interface/administracion/interfasAsistencia";
import { usarGetGrupos } from "@/apis/administracion/apisGrupos";
import { exitoToast } from "@/lib/notificaciones";
import Cargando from "@/components/Cargando";
import { manejoError, manejoErrorAsistencia } from "@/utils/mostrarErrores";
import pdfMake from "pdfmake/build/pdfmake"; // Importa pdfmake
import pdfFonts from "pdfmake/build/vfs_fonts"; // Importa los fonts para pdfmake
import { usarGetAsistenciasPorRangoYGrupo } from "@/apis/funcionalidades/apisAsistencias";
import { iconBase64 } from "@/utils/base64/marcaAgua";
import { Button } from "@/components/ui/button";
pdfMake.vfs = pdfFonts.pdfMake.vfs; // Configura las fuentes

type ColumnId = keyof DatosAsistencia;

export default function Asistencia() {
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

  const { data, isLoading, error } = usarGetAsistenciasPorRangoYGrupo(
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
      manejoErrorAsistencia(
        "Por favor, selecciona un grupo y establece un rango de fechas."
      );
    }
  };

  const handleGeneratePDF = () => {
    if (!data || data.length === 0) {
      manejoErrorAsistencia("No hay datos disponibles para generar el PDF.");
      return;
    }

    // Encuentra el nombre del grupo seleccionado basado en el ID
    /* const grupoSeleccionadoNombre =
      grupos.find((grupo) => grupo.id === Number(grupoSeleccionado))?.grupo ||
      "N/A"; */
    const grupoSeleccionadoNombre =
      grupos?.find((grupo) => grupo.id === Number(grupoSeleccionado))?.grupo ||
      "N/A";

    const columnasFiltradas = columnasAsistencias.filter((col) => {
      return (
        col.label !== "ID" &&
        data.some(
          (row) =>
            row[col.id as ColumnId] !== undefined &&
            row[col.id as ColumnId] !== null &&
            row[col.id as ColumnId] !== ""
        )
      );
    });

    const documentDefinition = {
      pageSize: "A4",
      pageOrientation: "portrait",
      pageMargins: [25, 25, 25, 25], // Márgenes de un documento oficial

      background: [
        {
          image: iconBase64, // Marca de agua en base64
          width: 400, // Ajuste del tamaño de la imagen
          opacity: 0.1,
          absolutePosition: {
            x: (595 - 400) / 2, // Centra horizontalmente en A4 vertical
            y: (842 - 400 * (842 / 595)) / 2 + 100, // Centra verticalmente
          },
        },
      ],
      content: [
        {
          text: "Reporte de Asistencias",
          style: "header",
          alignment: "center",
        },
        {
          text: [
            {
              text: `Grupo Seleccionado: ${grupoSeleccionadoNombre}\n`,
              bold: true,
            },
            {
              text: `Fecha de inicio: ${startDate} - Fecha de fin: ${endDate}\n`,
              bold: true,
            },
            {
              text: `Buscar por CI o Placa: ${introducirValor || "N/A"}`,
              bold: true,
            },
          ],
          style: "subheader",
          margin: [0, 10, 0, 10],
        },
        {
          style: "tableExample",
          table: {
            body: [
              [
                { text: "No.", style: "tableHeaderGreen" },
                ...columnasFiltradas.map((col) => ({
                  text: col.label.toUpperCase(),
                  style: "tableHeaderGreen",
                })),
              ],
              ...data.map((row, index) => [
                {
                  text: String(index + 1),
                  style: index % 2 === 0 ? "tableCellGray" : "tableCell",
                  border: [false, true, false, true],
                },
                ...columnasFiltradas.map((col) => ({
                  text: String(
                    row[col.id as ColumnId] !== undefined
                      ? row[col.id as ColumnId]
                      : ""
                  ),
                  style: index % 2 === 0 ? "tableCellGray" : "tableCell",
                  border: [false, true, false, true],
                })),
              ]),
            ],
          },
          layout: {
            hLineWidth: function () {
              return 0.5;
            },
            vLineWidth: function () {
              return 0.5;
            },
            hLineColor: function () {
              return "#CCCCCC";
            },
            vLineColor: function () {
              return "#CCCCCC";
            },
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 10,
          margin: [0, 5, 0, 10],
        },
        tableHeaderGreen: {
          fontSize: 8,
          bold: true,
          color: "#FFFFFF",
          fillColor: "#4CAF50",
          alignment: "center",
          margin: [0, 5],
        },
        tableCell: {
          fontSize: 8,
          margin: [5, 5],
          alignment: "left",
        },
        tableCellGray: {
          fontSize: 8,
          margin: [5, 5],
          alignment: "left",
          fillColor: "#F2F2F2",
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
      },
    };

    pdfMake.createPdf(documentDefinition).open();
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
                    {columnasAsistencias.map((col) => (
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
                      {columnasAsistencias.map((col) => (
                        <td key={col.id} className="px-6 py-4">
                          {row[col.id as ColumnId]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center my-5">
                <Button variant="flat5" onClick={handleGeneratePDF}>
                  <FileText />
                  Generar PDF
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
