"use client";
import { useState } from "react";
import { ChartBarIncreasing } from "lucide-react";
import MarcarParada from "../marcarparada/MarcarParada";
import Asistencia from "../asistencia/Asistencia";

export default function Reportes() {
  const [activeTab, setActiveTab] = useState("marcarparadas");

  const renderContent = () => {
    switch (activeTab) {
      case "asistencias":
        return <Asistencia />;
      case "marcarparadas":
        return <MarcarParada />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
        <ul className="flex flex-wrap -mb-px text-md font-medium text-center text-gray-500 dark:text-gray-400">
          <li className="me-2">
            <span
              onClick={() => setActiveTab("asistencias")}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                activeTab === "asistencias"
                  ? "border-micolor600 text-micolor600 dark:text-micolor500 dark:border-micolor500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
              <ChartBarIncreasing
                className={`w-4 h-4 me-2 ${
                  activeTab === "asistencias"
                    ? "text-micolor600 dark:text-micolor500"
                    : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                }`}
              />
              Reporte de Asistencias
            </span>
          </li>
          <li className="me-2">
            <span
              onClick={() => setActiveTab("marcarparadas")}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                activeTab === "marcarparadas"
                  ? "border-micolor600 text-micolor600 dark:text-micolor500 dark:border-micolor500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
              <ChartBarIncreasing
                className={`w-4 h-4 me-2 ${
                  activeTab === "marcarparadas"
                    ? "text-micolor600 dark:text-micolor500"
                    : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                }`}
              />
              Reporte de Llegada a las Paradas
            </span>
          </li>
        </ul>
      </div>

      <div>{renderContent()}</div>
    </div>
  );
}
