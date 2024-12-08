import { DatosGrupo, DatosGrupoPostPacht } from '@/interface/administracion/interfasGrupos';
import { obtenerDatosUsuario } from '@/utils/datosUsuarioLocalStor';
import { transformarGrupo } from '@/utils/transformarDatos/administracion/transformarGrupos';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

const headers = {
  Authorization: `Bearer ${obtenerDatosUsuario()?.tk}`,
};
const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}grupos`;

export function usarPostGrupo() {
  return useMutation({
    mutationFn: async (datosGrupo: DatosGrupoPostPacht): Promise<DatosGrupo> => {
      const { data } = await axios.post(apiUrl, datosGrupo, { headers });
      return data;
    },
  });
}
export function usarGetGrupos() {
  return useQuery({
    queryKey: ['grupos'],
    queryFn: async (): Promise<DatosGrupo[]> => {
      const { data } = await axios.get(apiUrl, { headers });
      const grupos = data.map((grupo: DatosGrupo) => transformarGrupo(grupo));
      return grupos;
    },
  });
}
export function usarGetGrupoFindOne(id: number) {
  return useQuery({
    queryKey: ['grupo', id],
    queryFn: async (): Promise<DatosGrupo> => {
      const { data } = await axios.get(`${apiUrl}/${id}`, { headers });
      return transformarGrupo(data);
    },
  });
}

export function usarGetfindAllGrupos(grupo: string) {
  return useQuery({
    queryKey: ['grupos', grupo],
    queryFn: async (): Promise<DatosGrupo[]> => {
      if (!grupo || grupo.trim() === "") {
        return [];
      }
      const { data } = await axios.get(`${apiUrl}/porgrupo/${grupo}`, { headers });
      const grupos = data.map((grupo: DatosGrupo) => transformarGrupo(grupo));
      return grupos;
    },
    enabled: !!grupo && grupo.trim() !== "",
  });
}
export function usarUpdateGrupo(id: number) {
  return useMutation({
    mutationFn: async (datosGrupo: DatosGrupoPostPacht): Promise<DatosGrupo> => {
      const { data } = await axios.patch(`${apiUrl}/${id}`, datosGrupo, { headers });
      return transformarGrupo(data);

    },
  });
}
export function usarRemoveGrupo(id: number) {
  return useMutation({
    mutationFn: async (): Promise<DatosGrupo> => {
      const { data } = await axios.delete(`${apiUrl}/${id}`, { headers });
      return transformarGrupo(data);

    }
  });
}