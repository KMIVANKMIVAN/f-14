import { errorToast } from "@/lib/notificaciones";

export const manejoError = (error: any) => {
  let mensaje = "RF: Error al enviar la solicitud";

  if (error.response) {
    const { data } = error.response;
    if (data.error || data.message) {
      mensaje = `RS: ${data.error || ""} ${data.message || ""}`.trim();
    }
  } else if (error.request) {
    mensaje = "RF: No se pudo obtener respuesta del servidor";
  }

  errorToast(mensaje);
};
export const manejoErrorMarcarParada = (error: any) => {
  errorToast(error);
};
export const manejoErrorHojaRuta = (error: any) => {
  errorToast(error);
};
export const manejoErrorAsistencia = (error: any) => {
  errorToast(error);
};
