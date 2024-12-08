import {
  DatosHojaRuta,
  DatosHojaRutaPostPacht,
} from "@/interface/administracion/interfasHojaRuta";
import { obtenerDatosUsuario } from "@/utils/datosUsuarioLocalStor";
import { transformarHojaRuta } from "@/utils/transformarDatos/funcionalidades/transformarMarcarParada";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const headers = {
  Authorization: `Bearer ${obtenerDatosUsuario()?.tk}`,
};
const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}hojarutas`;

export function usarPostHojaRuta() {
  return useMutation({
    mutationFn: async (
      datosHojaRuta: DatosHojaRutaPostPacht
    ): Promise<DatosHojaRuta> => {
      const { data } = await axios.post(
        `${apiUrl}/${obtenerDatosUsuario()?.id}`,
        datosHojaRuta,
        { headers }
      );
      return data;
    },
  });
}

export function usarGetHojaRutasPorRangoYGrupo(
  fechainicio: string,
  fechafin: string,
  id_grupo: number | null,
  cioplaca?: string // Hacer cioplaca opcional
) {
  return useQuery<DatosHojaRuta[], Error>({
    queryKey: ["hojarutas", fechainicio, fechafin, id_grupo, cioplaca],
    enabled: Boolean(fechainicio && fechafin && id_grupo), // Solo ejecutar la consulta si los parámetros son válidos
    queryFn: async (): Promise<DatosHojaRuta[]> => {
      let url = `${apiUrl}/porfecha/${fechainicio}/${fechafin}/${id_grupo}`;

      if (cioplaca) {
        url += `?cioplaca=${cioplaca}`;
      }

      const { data } = await axios.get(url, { headers });
      return data.map((grupo: DatosHojaRuta) => transformarHojaRuta(grupo));
    },
  });
}
