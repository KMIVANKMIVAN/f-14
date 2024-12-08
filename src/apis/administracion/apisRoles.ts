import { DatosRol, DatosRolPost } from '@/interface/administracion/interfasRoles';
import { obtenerDatosUsuario } from '@/utils/datosUsuarioLocalStor';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';


const headers = {
  Authorization: `Bearer ${obtenerDatosUsuario()?.tk}`,
};
const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}roles`;

export function usarPostRol() {
  return useMutation({
    mutationFn: async (datosRol: DatosRolPost): Promise<DatosRol> => {
      const { data } = await axios.post(apiUrl, datosRol, { headers });
      return data;
    },
  });
}
export function usarGetRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async (): Promise<DatosRol[]> => {
      const { data } = await axios.get(apiUrl, { headers });
      const roles = data.map((rol: DatosRol) => rol);
      return roles;
    },
  });
}
export function usarGetRolFindOne(id: number) {
  return useQuery({
    queryKey: ['rol', id], 
    queryFn: async (): Promise<DatosRol> => {
      const { data } = await axios.get(`${apiUrl}/${id}`, { headers });
      return data; 
    },
  });
}

export function usarGetfindAllRoles(rol: string) {
  return useQuery({
    queryKey: ['roles', rol], 
    queryFn: async (): Promise<DatosRol[]> => {
      if (!rol || rol.trim() === "") {
        return []; 
      }
      const { data } = await axios.get(`${apiUrl}/porrol/${rol}`, { headers });
      const roles = data.map((rol: DatosRol) => rol);
      return roles;
    },
    enabled: !!rol && rol.trim() !== "", 
  });
}
export function usarUpdateRol(id: number) {
  return useMutation({
    mutationFn: async (datosRol: DatosRolPost): Promise<DatosRol> => {
      const { data } = await axios.patch(`${apiUrl}/${id}`, datosRol, { headers });
      return data; 
    },
  });
}
export function usarRemoveRol(id: number) {
  return useMutation({
    mutationFn: async (): Promise<DatosRol> => {
      const { data } = await axios.delete(`${apiUrl}/${id}`, { headers });
      return data;
    }
  });
}