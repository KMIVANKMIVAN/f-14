"use client";
import { eliminarDatosUsuario } from "@/utils/datosUsuarioLocalStor";
import { Button } from "@/components/ui/button";
import MenuLateral from "@/components/MenuLateral";

export default function NotFound() {
  return (
    <div>
      <MenuLateral>
        <section className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
          <div className="px-4 mx-auto max-w-screen-xl text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
              404
            </h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
              Falta algo.
            </p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
              Lo sentimos, no podemos encontrar esa página. Encontrarás mucho
              que explorar en la página de inicio.
            </p>
            <div
              onClick={() => {
                eliminarDatosUsuario(), (window.location.href = "/");
              }}
              className="flex justify-center items-center"
            >
              <Button
                variant="flat5"
                className="w-full md:w-auto flex items-center justify-center"
              >
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Volver a la página de inicio
                </span>
              </Button>
            </div>
          </div>
        </section>
      </MenuLateral>
    </div>
  );
}
