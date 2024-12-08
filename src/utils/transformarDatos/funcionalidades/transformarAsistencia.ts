import { DatosAsistencia } from "@/interface/administracion/interfasAsistencia";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
export const transformarAsistencia = (
  asistencia: DatosAsistencia
): DatosAsistencia => {
  return {
    id: asistencia.id,
    fecha_registro: dayjs(asistencia.fecha_registro)
      .tz("America/La_Paz")
      .format("DD/MM/YYYY HH:mm"),
    nombres: asistencia.nombres,
    apellidos: asistencia.apellidos,
    ci: asistencia.ci,
    placa: asistencia.placa,
    propietario: asistencia.propietario,

    grupo: asistencia.grupo,
    nro: asistencia.nro,
  };
};
