import { DatosUsuarioTk } from "@/interface/administracion/interfasUsuarios";
import Cookies from 'js-cookie';

const tokenExpirado = (exp: number | undefined): boolean => {
  if (!exp) {
    return true; 
  }

  const fechaActual = Math.floor(Date.now() / 1000);

  return exp < fechaActual;
};

export const guardarDatosUsuario = (datosUsuario: DatosUsuarioTk): void => {
  try {

    Cookies.set("datosUsuario", JSON.stringify(datosUsuario), { expires: 1 });

  } catch (error) {
    console.error("Error al guardar los datos del usuario", error);
  }
};

export const obtenerDatosUsuario = (): DatosUsuarioTk | null => {
  try {
    const datosUsuario = Cookies.get("datosUsuario");

    if (!datosUsuario) {
      window.location.href = "/"; 
      return null;
    }

    const usuarioParseado = JSON.parse(datosUsuario) as DatosUsuarioTk;

    if (tokenExpirado(usuarioParseado.exp)) {
      Cookies.remove("datosUsuario");
      window.location.href = "/";
      return null;
    }

    return usuarioParseado;
  } catch (error) {
    console.error("Error al obtener los datos del usuario desde cookies:", error);
    return null;
  }
};

export const eliminarDatosUsuario = (): void => {
  try {
    Cookies.remove("datosUsuario");
  } catch (error) {
  }
};
