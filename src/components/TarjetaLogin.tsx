"use client";

import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { guardarDatosUsuario } from "@/utils/datosUsuarioLocalStor";
import { DatosUsuarioTk } from "@/interface/administracion/interfasUsuarios";

interface LoginFormInputs {
  ci: string;
  contrasenia: string;
}

interface LoginResponse {
  tk: string;
}
export interface DatosRol {
  id: number;
  rol: string;
}

/* interface DecodedUserData {
  es_activo: boolean;
  camb_contra: boolean;
  rol: {
    rol: string;
  };
} */
interface DecodedUserData {
  id: number;
  ci: string;
  es_activo: boolean;
  camb_contra: boolean;
  rol: {
    rol: string;
  };
  iat: number; // Tiempo en el que se emitió el token
  exp: number; // Tiempo de expiración del token
}

export default function TarjetaLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const loginUrl = `${apiUrl}auth/login`;

  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginErrorMensaje, setLoginErrorMensaje] = useState<string | null>(
    null
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const respuesta = await axios.post<LoginResponse>(loginUrl, data);
      const { tk } = respuesta.data;
      const datosUsuario = jwtDecode<DecodedUserData>(tk);

      if (datosUsuario.es_activo) {
        /* const convinarDatosUsuario: DatosUsuarioTk = {
          tk: tk,
          ...datosUsuario,
        }; */
        const rol: DatosRol = {
          id: datosUsuario.id, // Asegúrate de tener el id_rol disponible
          rol: datosUsuario.rol.rol, // Esto debe ser el string del rol
        };

        // Creando el objeto convinarDatosUsuario incluyendo el rol correctamente formateado
        const convinarDatosUsuario: DatosUsuarioTk = {
          tk: tk,
          id: datosUsuario.id,
          ci: datosUsuario.ci,
          iat: datosUsuario.iat,
          exp: datosUsuario.exp,
          es_activo: datosUsuario.es_activo,
          camb_contra: datosUsuario.camb_contra,
          rol: rol, // Asignamos el rol con el formato adecuado
        };

        guardarDatosUsuario(convinarDatosUsuario);

        if (convinarDatosUsuario.camb_contra) {
          router.push(
            convinarDatosUsuario.rol.rol === "Administrador"
              ? "/panel/administracion/usuarios"
              : "/panel/marcarparda/inicio"
          );
        } else {
          router.push("/cambiarpw");
        }
      } else {
        setLoginError("Usted no es un Usuario Activo");
      }
    } catch (error: any) {
      if (error.response) {
        const { data } = error.response;
        setLoginError(
          data.error
            ? `RS: ${data.error}`
            : data.message
            ? `RS: ${data.message}`
            : "Error desconocido"
        );
      } else if (error.request) {
        setLoginError("RF: No se pudo obtener respuesta del servidor");
      } else {
        setLoginError("RF: Error al enviar la solicitud");
      }
    }
  };

  return (
    <div>
      <div className="bg-micolor900 absolute top-0 left-0 bg-gradient-to-b from-gray-900 via-gray-900 to-micolor800 bottom-0 leading-5 h-full w-full overflow-hidden"></div>
      <div className="relative min-h-screen flex items-center justify-center bg-transparent rounded-3xl shadow-xl">
        <div className="flex-col flex self-center lg:px-14 sm:max-w-4xl xl:max-w-md z-10">
          <div className="self-start hidden lg:flex flex-col text-gray-300">
            <h1 className="my-3 font-semibold text-4xl">Bienvenido de nuevo</h1>
            <p className="pr-3 text-sm opacity-75">
              Ingrese los detalles de inicio de sesión
            </p>
          </div>
        </div>
        <div className="flex justify-center self-center z-10">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-12 bg-white mx-auto rounded-3xl w-96">
              <div className="mb-7">
                <h3 className="font-semibold text-2xl text-micolor900">
                  Iniciar
                </h3>
              </div>
              <div className="space-y-6">
                <div>
                  <input
                    className="w-full text-sm text-micolor900 bg-transparent px-4 py-3 border border-micolor900 rounded-lg focus:outline-none focus:border-micolor400"
                    type="text"
                    placeholder="CI"
                    {...register("ci", { required: "El CI es requerido" })}
                  />
                </div>
                {errors.ci && (
                  <p className="text-red-500">{errors.ci.message}</p>
                )}
                <div className="relative">
                  <input
                    placeholder="Contraseña"
                    type={showPassword ? "text" : "password"}
                    className="text-sm  px-4 py-3 text-micolor900 bg-transparent rounded-lg w-full border border-micolor900 focus:outline-none focus:border-micolor400"
                    {...register("contrasenia", {
                      required: "La Contraseña es requerida",
                    })}
                  />
                  <div className="flex items-center absolute inset-y-0 right-0 mr-3 text-sm leading-5 cursor-pointer">
                    {showPassword ? (
                      <EyeOff
                        onClick={() => setShowPassword(!showPassword)}
                        className="h-4 text-micolor700"
                      />
                    ) : (
                      <Eye
                        onClick={() => setShowPassword(!showPassword)}
                        className="h-4 text-micolor700"
                      />
                    )}
                  </div>
                </div>
                {errors.contrasenia && (
                  <p className="text-red-500">{errors.contrasenia.message}</p>
                )}
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center bg-micolor800 hover:bg-micolor700 text-gray-100 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500"
                  >
                    Iniciar
                  </button>
                </div>
                {(loginError || loginErrorMensaje) && (
                  <div className="py-2">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Mensaje</AlertTitle>
                      {loginError && (
                        <AlertDescription>{loginError}</AlertDescription>
                      )}
                      {loginErrorMensaje && (
                        <AlertDescription>{loginErrorMensaje}</AlertDescription>
                      )}
                    </Alert>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
