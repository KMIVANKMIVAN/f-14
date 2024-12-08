import { DatosHojaRuta } from "@/interface/administracion/interfasHojaRuta";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
export const transformarHojaRuta = (
  hojaruta: DatosHojaRuta
): DatosHojaRuta => {
  return {
    id: hojaruta.id,
    monto: hojaruta.monto,
    nombres: hojaruta.nombres,
    apellidos: hojaruta.apellidos,
    ci: hojaruta.ci,
    placa: hojaruta.placa,
    propietario: hojaruta.propietario,

    grupo: hojaruta.grupo,
    nro: hojaruta.nro,

    fecha_registro: dayjs(hojaruta.fecha_registro)
      .tz("America/La_Paz")
      .format("DD/MM/YYYY HH:mm"),
  };
};
