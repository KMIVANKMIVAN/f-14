"use client";

import { Eye, EyeOff } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

import {
  eliminarDatosUsuario,
  obtenerDatosUsuario,
} from "@/utils/datosUsuarioLocalStor";
import { DatosUsuarioPachtPW } from "@/interface/administracion/interfasUsuarios";
import { usarUpdateUsuarioPW } from "@/apis/administracion/apisUsuarios";
import { exitoToast } from "@/lib/notificaciones";
import { manejoError } from "@/utils/mostrarErrores";

interface FormInputs {
  passwordAntigua: string;
  password: string;
  confirContrasenia: string;
}

export default function TarjetaCambiarContra() {
  const datosUsuario = obtenerDatosUsuario();

  if (!datosUsuario || typeof datosUsuario.id !== "number") {
    // Maneja el caso cuando no hay usuario o el id no es válido
    console.error("Error: El ID de usuario no es válido");
    return null;
  }
  const {
    mutate: updateUsuario,
    isSuccess,
    error,
    data: usuarioActualizado,
  } = usarUpdateUsuarioPW(datosUsuario.id.toString());

  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const usuarioPacht: DatosUsuarioPachtPW = {
      contrasenia: data.password,
    };

    updateUsuario(usuarioPacht);
  };
  if (isSuccess) {
    exitoToast(
      `Se actualizó la Contraseña de el usuario: ${usuarioActualizado.nombres}`
    );
    setTimeout(() => {
      eliminarDatosUsuario();
      window.location.href = "/";
    }, 2000);
  }
  if (error) manejoError(error);
  return (
    <div>
      <div
        className="flex h-screen w-full items-center justify-center bg-gray-900 bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/p1.png')",
        }}
      >
        <div className="rounded-xl  bg-gray-800 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-7">
              <h3 className="font-semibold text-2xl text-white">
                Actualizar Contraseña
              </h3>
            </div>
            <div className="space-y-6">
              <div>
                <input
                  className="w-full text-sm px-4 py-3 bg-transparent border border-gray-200 rounded-lg focus:outline-none focus:border-micolor400"
                  type="text"
                  placeholder="Contraseña anterior"
                  {...register("passwordAntigua", {
                    required: {
                      value: true,
                      message: "La Contraseña Anterior es requerida",
                    },
                  })}
                />
              </div>
              {errors.passwordAntigua && (
                <p className="text-red-500">{errors.passwordAntigua.message}</p>
              )}
              <div className="relative">
                <input
                  placeholder="Nueva Contraseña"
                  type={mostrarContrasenia ? "text" : "password"}
                  className="text-sm  px-4 py-3 rounded-lg w-full bg-transparent border border-gray-200 focus:outline-none focus:border-micolor400"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "La Contraseña es requerida",
                    },
                    minLength: {
                      value: 8,
                      message: "La Contraseña debe tener al menos 8 caracteres",
                    },
                    validate: {
                      hasUpperCase: (value) =>
                        /[A-Z]/.test(value) ||
                        "La Contraseña debe tener al menos una letra mayúscula",
                      hasLowerCase: (value) =>
                        /[a-z]/.test(value) ||
                        "La Contraseña debe tener al menos una letra minúscula",
                      hasNumber: (value) =>
                        /[0-9]/.test(value) ||
                        "La Contraseña debe tener al menos un número",
                      hasSpecialChar: (value) =>
                        /[!@#$%^&*(),.?":{}|<div>/`]/.test(value) ||
                        "La Contraseña debe tener al menos un carácter especial",
                    },
                  })}
                />
                <div className="flex items-center absolute inset-y-0 right-0 mr-3 text-sm leading-5 cursor-pointer">
                  {mostrarContrasenia ? (
                    <EyeOff
                      onClick={() => setMostrarContrasenia(!mostrarContrasenia)}
                      className="h-4 text-micolor700"
                    />
                  ) : (
                    <Eye
                      onClick={() => setMostrarContrasenia(!mostrarContrasenia)}
                      className="h-4 text-micolor700"
                    />
                  )}
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
              <div className="relative">
                <input
                  placeholder="Confirmar Contraseña"
                  type={mostrarContrasenia ? "text" : "password"}
                  className="text-sm  px-4 py-3 rounded-lg w-full bg-transparent border border-gray-200 focus:outline-none focus:border-micolor400"
                  {...register("confirContrasenia", {
                    required: {
                      value: true,
                      message: "Confirmar la Contraseña es requerida",
                    },
                    validate: (value) =>
                      value === watch("password") ||
                      "Las Contraseñas no coinciden",
                  })}
                />
                <div className="flex items-center absolute inset-y-0 right-0 mr-3 text-sm leading-5 cursor-pointer">
                  {mostrarContrasenia ? (
                    <EyeOff
                      onClick={() => setMostrarContrasenia(!mostrarContrasenia)}
                      className="h-4 text-micolor700"
                    />
                  ) : (
                    <Eye
                      onClick={() => setMostrarContrasenia(!mostrarContrasenia)}
                      className="h-4 text-micolor700"
                    />
                  )}
                </div>
              </div>
              {errors.confirContrasenia && (
                <p className="text-red-500">
                  {errors.confirContrasenia.message}
                </p>
              )}
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center bg-micolor800 hover:bg-micolor700 text-gray-100 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500"
                >
                  Actualizar Contraseña
                </button>
              </div>
            </div>
            {/* </div> */}
          </form>
        </div>
      </div>
    </div>
  );
}
