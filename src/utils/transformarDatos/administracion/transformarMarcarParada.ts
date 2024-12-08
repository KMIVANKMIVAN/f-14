import { DatosMarcarParada } from "@/interface/administracion/interfasMarcarParada";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
export const transformarMarcarParada = (marcarparada: DatosMarcarParada): DatosMarcarParada => {


  return {
    id: marcarparada.id,
    tipo: marcarparada.tipo,
    nombres: marcarparada.nombres,
    apellidos: marcarparada.apellidos,
    ci: marcarparada.ci,
    placa: marcarparada.placa,
    propietario: marcarparada.propietario,

    grupo: marcarparada.grupo,
    nro: marcarparada.nro,
    
    parada: marcarparada.parada,
    tipo_parada: marcarparada.tipo_parada,

    fecha_registro: dayjs(marcarparada.fecha_registro)
      .tz("America/La_Paz")
      .format("DD/MM/YYYY HH:mm"),
  };
};