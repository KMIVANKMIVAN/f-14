
import { DatosParada } from "@/interface/funcionalidades/interfasParadas";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export const transformarParada = (parada: DatosParada): DatosParada => {
  return {
    ...parada,
    fecha_registro: dayjs(parada.fecha_registro)
      .tz("America/La_Paz")
      .format("DD/MM/YYYY HH:mm"), 
    fecha_actualizacion: dayjs(parada.fecha_actualizacion)
      .tz("America/La_Paz")
      .format("DD/MM/YYYY HH:mm"), 
  };
};