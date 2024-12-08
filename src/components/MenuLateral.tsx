"use client";

import { useRef, useEffect, useState } from "react";
import {
  Users,
  ChevronDown,
  LogOut,
  AlignLeft,
  Bolt,
  LockKeyhole,
  FileClock,
  MapPinned,
  HandCoins,
  ArrowBigRightDash,
  ArrowBigLeftDash,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ModoDarck from "./ModoDarck";
import { Button } from "./ui/button";
import {
  eliminarDatosUsuario,
  obtenerDatosUsuario,
} from "@/utils/datosUsuarioLocalStor";

export default function MenuLateral({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [rol, setRol] = useState<string | null>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      sidebarRef.current.classList.add("-translate-x-full");
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => {
    if (sidebarRef.current) {
      sidebarRef.current.classList.toggle("-translate-x-full");
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };
  const handleLinkClick = () => {
    if (window.innerWidth < 640) {
      setIsSidebarOpen(false);
      if (sidebarRef.current) {
        sidebarRef.current.classList.add("-translate-x-full");
      }
    }
  };

  useEffect(() => {
    // Ejecuta la lógica solo en el cliente
    const usuario = obtenerDatosUsuario();
    if (usuario?.rol?.rol) {
      setRol(usuario.rol.rol);
    }
  }, []);

  return (
    <div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-700 bg-opacity-10 backdrop-blur-sm sm:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside
        id="separator-sidebar"
        ref={sidebarRef}
        className="shadow-xl fixed top-0 left-0 z-40 w-64 h-screen -translate-x-full sm:translate-x-0 transition-transform sm:block bg-white dark:bg-gray-800"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="flex flex-col items-center p-4">
            <div className=" flex items-center justify-center">
              <Image
                src="/assets/icon1-sinfondo.png"
                alt="Imagen de ejemplo"
                width={100}
                height={100}
              />
            </div>
            <span className="mt-2 text-center text-sm font-semibold">
              Sindicato Mixto De Transporte 14 De Septiembre-Chasquipampa
            </span>
          </div>
          <hr className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700" />
          {rol === "Administrador" && (
            <div>
              <span className="flex-1 ms-3 whitespace-nowrap text-gray-500 text-xs">
                Generencia
              </span>
              <ul className="space-y-2 font-medium ml-4">
                <li>
                  <Link
                    onClick={handleLinkClick}
                    href="/panel/administracion/usuarios"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <Users
                      className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      aria-hidden="true"
                    />
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Usuarios
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={handleLinkClick}
                    href="/panel/administracion"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <Bolt className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Administracion
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={handleLinkClick}
                    href="/panel/administracion/reportes"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <FileText className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Reportes
                    </span>
                  </Link>
                </li>
              </ul>
              <hr className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700" />
            </div>
          )}
          <span className="flex-1 ms-3 whitespace-nowrap text-gray-500 text-xs">
            Funcionalidades
          </span>
          <ul className="space-y-2 font-medium ml-4">
            <li>
              <Link
                href="/cambiarpw"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <LockKeyhole className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Cambiar Contraseña
                </span>
              </Link>
            </li>
            <li>
              <Link
                onClick={handleLinkClick}
                href="/panel/marcarasistencia"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FileClock className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Tomar Asistencia
                </span>
              </Link>
            </li>
            <li>
              <div
                onClick={toggleSubMenu}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer group"
              >
                <MapPinned className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Marcar Parada
                </span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isSubMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
              {isSubMenuOpen && (
                <ul className="capitalize ml-4 mt-2 space-y-2">
                  <li>
                    <Link
                      onClick={handleLinkClick}
                      href="/panel/marcarparda/inicio"
                      className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer group"
                    >
                      <ArrowBigRightDash className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                      <span className="flex-1 ms-3 whitespace-nowrap">
                        zona sur
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={handleLinkClick}
                      href="/panel/marcarparda/final"
                      className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer group"
                    >
                      <ArrowBigLeftDash className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                      <span className="flex-1 ms-3 whitespace-nowrap">
                        zona central
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link
                onClick={handleLinkClick}
                href="/panel/registrarhojaruta"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <HandCoins className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Registrar Hoja de Ruta
                </span>
              </Link>
            </li>
          </ul>

          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700 ml-4">
            <li>
              <div
                onClick={() => {
                  eliminarDatosUsuario(), (window.location.href = "/");
                }}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <LogOut className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">Salir</span>
              </div>
            </li>
          </ul>
        </div>
      </aside>

      <div className="px-4 sm:ml-64 ">
        <div className="dark:bg-gray-800 shadow-xl my-2  w-full h-14 rounded-md flex items-center justify-end p-1 pr-2 ">
          {/* <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-full">
            <Image
              src="/assets/ani.jpg"
              alt="Imagen de ejemplo"
              width={10}
              height={10}
              className="w-full h-full object-cover"
            />
          </div> */}
          <span className="ml-2 mr-4 text-xs ">
            ivan.ch.developer@gmail.com
          </span>
          <ModoDarck />
          <div className="sm:hidden">
            <Button
              className="ml-2"
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              aria-controls="separator-sidebar"
            >
              <AlignLeft />
            </Button>
          </div>
        </div>
        <div className="my-6">{children}</div>
      </div>
    </div>
  );
}
