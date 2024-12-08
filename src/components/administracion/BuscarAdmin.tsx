"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import useStoreTextoBuscar from "@/store/administracion/textoBuscarStor";

interface BuscarAdminProps {
  accionCompo: string;
}

export default function BuscarAdmin({ accionCompo }: BuscarAdminProps) {
  const { setTextoBuscarUsuarioStory, setTextoBuscarRolStory ,setTextoBuscarGrupoStory} =
    useStoreTextoBuscar();

  const [introducirValor, setIntroducirValor] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIntroducirValor(event.target.value);
  };

  const handleSearchClick = () => {
    switch (accionCompo) {
      case "usuarios":
        setTextoBuscarUsuarioStory(introducirValor);
      case "roles":
        setTextoBuscarRolStory(introducirValor);
      case "grupos":
        setTextoBuscarGrupoStory(introducirValor);
      default:
        break;
    }
  };

  return (
    <div className="w-full md:w-1/2">
      <div className="flex items-center">
        <div className="relative w-full">
          <div
            className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
            onClick={handleSearchClick}
          >
            <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            id="simple-search"
            value={introducirValor}
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Buscar"
          />
        </div>
      </div>
    </div>
  );
}
