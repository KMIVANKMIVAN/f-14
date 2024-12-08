"use client";
import { useState } from "react";
import Role from "@/components/administracion/roles/Role";
import {
  ChartBarIncreasing,
  FolderKey,
  MapPinCheck,
  MapPinPlusInside,
} from "lucide-react";
import RegistrarParada from "./registrarparada/RegistrarParada";
import Paradas from "./registrarparada/Paradas";
import refrescarAdminParadaStore from "@/store/administracion/refrescarAdminParada";
import Grupo from "./grupos/Grupo";

export default function TapsAdmin() {
  const { contadorRefrescar } = refrescarAdminParadaStore();

  const [activeTab, setActiveTab] = useState("grupos");

  const renderContent = () => {
    switch (activeTab) {
      case "roles":
        return <Role />;
      case "registrarparadas":
        return <RegistrarParada />;
      case "grupos":
        return <Grupo />;
      case "paradas":
        return <Paradas key={contadorRefrescar} />;
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
              onClick={() => setActiveTab("roles")}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                activeTab === "roles"
                  ? "border-micolor600 text-micolor600 dark:text-micolor500 dark:border-micolor500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
              <FolderKey
                className={`w-4 h-4 me-2 ${
                  activeTab === "roles"
                    ? "text-micolor600 dark:text-micolor500"
                    : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                }`}
              />
              Roles
            </span>
          </li>
          <li className="me-2">
            <span
              onClick={() => setActiveTab("grupos")}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                activeTab === "grupos"
                  ? "border-micolor600 text-micolor600 dark:text-micolor500 dark:border-micolor500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
              <ChartBarIncreasing
                className={`w-4 h-4 me-2 ${
                  activeTab === "grupos"
                    ? "text-micolor600 dark:text-micolor500"
                    : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                }`}
              />
              Grupos
            </span>
          </li>
          <li className="me-2">
            <span
              onClick={() => setActiveTab("registrarparadas")}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                activeTab === "registrarparadas"
                  ? "border-micolor600 text-micolor600 dark:text-micolor500 dark:border-micolor500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
              <MapPinPlusInside
                className={`w-4 h-4 me-2 ${
                  activeTab === "registrarparadas"
                    ? "text-micolor600 dark:text-micolor500"
                    : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                }`}
              />
              Registrar Parada
            </span>
          </li>
          <li className="me-2">
            <span
              onClick={() => setActiveTab("paradas")}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                activeTab === "paradas"
                  ? "border-micolor600 text-micolor600 dark:text-micolor500 dark:border-micolor500"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
              <MapPinCheck
                className={`w-4 h-4 me-2 ${
                  activeTab === "paradas"
                    ? "text-micolor600 dark:text-micolor500"
                    : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                }`}
              />
              Administrar Paradas
            </span>
          </li>
        </ul>
      </div>

      <div>{renderContent()}</div>
    </div>
  );
}
