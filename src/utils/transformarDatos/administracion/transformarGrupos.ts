import { DatosGrupo } from "@/interface/administracion/interfasGrupos";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export const transformarGrupo = (grupo: DatosGrupo): DatosGrupo => {
  return {
    id: grupo.id,
    grupo: grupo.grupo,
    nro: grupo.nro,
    fecha_registro: dayjs(grupo.fecha_registro)
      .tz("America/La_Paz")
      .format("DD/MM/YYYY HH:mm"),
    fecha_actualizacion: dayjs(grupo.fecha_actualizacion)
      .tz("America/La_Paz")
      .format("DD/MM/YYYY HH:mm"),
  };
};