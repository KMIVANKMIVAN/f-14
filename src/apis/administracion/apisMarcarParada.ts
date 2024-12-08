
import { DatosMarcarParada, DatosMarcarParadaPostPacht, ParamsRangoFechasYGrupo } from '@/interface/administracion/interfasMarcarParada';
import { obtenerDatosUsuario } from '@/utils/datosUsuarioLocalStor';
import { transformarMarcarParada } from '@/utils/transformarDatos/administracion/transformarMarcarParada';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

const headers = {
  Authorization: `Bearer ${obtenerDatosUsuario()?.tk}`,
};
const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}marcarparadas`;

export function usarPostMarcarParada() {
  return useMutation({
    mutationFn: async (datosMarcarParada: DatosMarcarParadaPostPacht): Promise<DatosMarcarParada> => {
      const { data } = await axios.post(apiUrl, datosMarcarParada, { headers });
      return data;
    },
  });
}
export function usarGetMarcarParadas() {
  return useQuery({
    queryKey: ['marcarparadas'],
    queryFn: async (): Promise<DatosMarcarParada[]> => {
      const { data } = await axios.get(`${apiUrl}/transformados`, { headers });
      const marcarparadas = data.map((grupo: DatosMarcarParada) => transformarMarcarParada(grupo));
      return marcarparadas;
    },
  });
}
export function usarGetMarcarParadasPorRangoYGrupo(
  fechainicio: string,
  fechafin: string,
  id_grupo: number | null,
  cioplaca?: string // Hacer cioplaca opcional
) {
  return useQuery<DatosMarcarParada[], Error>({
    queryKey: ['marcarparadas', fechainicio, fechafin, id_grupo, cioplaca],
    enabled: Boolean(fechainicio && fechafin && id_grupo), // Solo ejecutar la consulta si los parámetros son válidos
    queryFn: async (): Promise<DatosMarcarParada[]> => {
      let url = `${apiUrl}/porfecha/${fechainicio}/${fechafin}/${id_grupo}`;

      if (cioplaca) {
        url += `?cioplaca=${cioplaca}`;
      }

      const { data } = await axios.get(url, { headers });
      return data.map((grupo: DatosMarcarParada) => transformarMarcarParada(grupo));
    },
  });
}
/* export function usarGetMarcarParadasPorRangoYGrupo(
  fechainicio: string,
  fechafin: string,
  id_grupo: number,
  cioplaca?: string // Hacer cioplaca opcional
) {
  return useQuery({
    queryKey: ['marcarparadas', fechainicio, fechafin, id_grupo, cioplaca],
    queryFn: async (): Promise<DatosMarcarParada[]> => {
      // Construye la URL base
      // let url = `${apiUrl}/porfecha/${fechafin}/${fechainicio}/${id_grupo}`;
      let url = `${apiUrl}/porfecha/${fechainicio}/${fechafin}/${id_grupo}`;

      // Agrega el parámetro cioplaca solo si existe
      if (cioplaca) {
        url += `?cioplaca=${cioplaca}`;
      }

      const { data } = await axios.get(url, { headers });
      const marcarparadas = data.map((grupo: DatosMarcarParada) => transformarMarcarParada(grupo));
      return marcarparadas;
    },
  });
} */

export function usarGetMarcarParadaFindOne(id: number) {
  return useQuery({
    queryKey: ['grupo', id],
    queryFn: async (): Promise<DatosMarcarParada> => {
      const { data } = await axios.get(`${apiUrl}/${id}`, { headers });
      return transformarMarcarParada(data);
    },
  });
}

export function usarGetfindAllMarcarParadas(grupo: string) {
  return useQuery({
    queryKey: ['marcarparadas', grupo],
    queryFn: async (): Promise<DatosMarcarParada[]> => {
      if (!grupo || grupo.trim() === "") {
        return [];
      }
      const { data } = await axios.get(`${apiUrl}/porgrupo/${grupo}`, { headers });
      const marcarparadas = data.map((grupo: DatosMarcarParada) => transformarMarcarParada(grupo));
      return marcarparadas;
    },
    enabled: !!grupo && grupo.trim() !== "",
  });
}