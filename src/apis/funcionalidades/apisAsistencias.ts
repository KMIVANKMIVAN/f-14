import {
  DatosAsistencia,
  DatosAsistenciaPostPacht,
} from "@/interface/administracion/interfasAsistencia";
import { obtenerDatosUsuario } from "@/utils/datosUsuarioLocalStor";
import { transformarAsistencia } from "@/utils/transformarDatos/funcionalidades/transformarAsistencia";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const headers = {
  Authorization: `Bearer ${obtenerDatosUsuario()?.tk}`,
};
const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}asistencias`;

export function usarPostAsistencia() {
  return useMutation({
    mutationFn: async (
      datosAsistencia: DatosAsistenciaPostPacht
    ): Promise<DatosAsistencia> => {
      const { data } = await axios.post(apiUrl, datosAsistencia, { headers });
      return data;
    },
  });
}

export function usarGetAsistenciasPorRangoYGrupo(
  fechainicio: string,
  fechafin: string,
  id_grupo: number | null,
  cioplaca?: string // Hacer cioplaca opcional
) {
  return useQuery<DatosAsistencia[], Error>({
    queryKey: ["asistencias", fechainicio, fechafin, id_grupo, cioplaca],
    enabled: Boolean(fechainicio && fechafin && id_grupo), // Solo ejecutar la consulta si los parámetros son válidos
    queryFn: async (): Promise<DatosAsistencia[]> => {
      let url = `${apiUrl}/porfecha/${fechainicio}/${fechafin}/${id_grupo}`;

      if (cioplaca) {
        url += `?cioplaca=${cioplaca}`;
      }

      const { data } = await axios.get(url, { headers });
      return data.map((grupo: DatosAsistencia) => transformarAsistencia(grupo));
    },
  });
}
