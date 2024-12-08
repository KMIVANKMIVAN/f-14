import {
  DatosCIPlaca,
  DatosUsuario,
  DatosUsuarioPachtPW,
  DatosUsuarioPost,
} from "@/interface/administracion/interfasUsuarios";

import { obtenerDatosUsuario } from "@/utils/datosUsuarioLocalStor";
import {
  transformarUsuario,
  transformarUsuarioRolGrupo,
} from "@/utils/transformarDatos/administracion/transformarUsuarios";
import axios from "axios";

import { useMutation, useQuery } from "@tanstack/react-query";

const headers = {
  Authorization: `Bearer ${obtenerDatosUsuario()?.tk}`,
};
const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}usuarios`;

export function usarPostUsuario() {
  return useMutation({
    mutationFn: async (
      datosUsuario: DatosUsuarioPost
    ): Promise<DatosUsuario> => {
      const { data } = await axios.post(
        `${apiUrl}/${obtenerDatosUsuario()?.id}`,
        datosUsuario,
        { headers }
      );
      return transformarUsuario(data);
    },
  });
}

export function usarGetUsuarios() {
  return useQuery({
    queryKey: ["usuarios"],
    queryFn: async (): Promise<DatosUsuario[]> => {
      const { data } = await axios.get(apiUrl, { headers });
      const usuarios = data.map((usuario: DatosUsuario) =>
        transformarUsuario(usuario)
      );
      return usuarios;
    },
  });
}

export function usarGetUsuarioFindOne(id: string) {
  return useQuery({
    queryKey: ["usuario", id],
    queryFn: async (): Promise<DatosUsuario> => {
      const { data } = await axios.get(`${apiUrl}/${id}`, { headers });
      return transformarUsuario(data);
    },
  });
}

export function usarGetUsuariosFindOneCI(ci: string) {
  return useQuery({
    queryKey: ["usuariosPorCI", ci],
    queryFn: async (): Promise<DatosUsuario> => {
      const { data } = await axios.get(`${apiUrl}/exacto/porci/${ci}`, {
        headers,
      });
      return transformarUsuario(data);
    },
  });
}

export function usarGetUsuariosFindAllCIPlaca(ciplaca: string) {
  return useQuery({
    queryKey: ["usuariosPorCIPlaca", ciplaca],
    queryFn: async (): Promise<DatosCIPlaca> => {
      const { data } = await axios.get(`${apiUrl}/porciplaca/${ciplaca}`, {
        headers,
      });
      return data;
    },
  });
}

export function usarGetUsuariosFindAllCI(ci: string) {
  return useQuery({
    queryKey: ["usuarios", ci],
    queryFn: async (): Promise<DatosUsuario[]> => {
      if (!ci || ci.trim() === "") {
        return [];
      }
      const { data } = await axios.get(`${apiUrl}/porci/${ci}`, { headers });
      const usuarios = data.map((usuario: DatosUsuario) =>
        transformarUsuarioRolGrupo(usuario)
      );

      return usuarios;
    },
    enabled: !!ci && ci.trim() !== "",
  });
}

export function usarUpdateUsuario(id: string) {
  return useMutation({
    mutationFn: async (
      datosUsuario: DatosUsuarioPost
    ): Promise<DatosUsuario> => {
      const { data } = await axios.patch(`${apiUrl}/${id}`, datosUsuario, {
        headers,
      });
      return transformarUsuario(data);
    },
  });
}
export function usarUpdateUsuarioPW(id: string) {
  return useMutation({
    mutationFn: async (
      datosUsuario: DatosUsuarioPachtPW
    ): Promise<DatosUsuario> => {
      // Cambiar el tipo aquí
      const { data } = await axios.patch(`${apiUrl}/pw/${id}`, datosUsuario, {
        headers,
      });
      return transformarUsuario(data);
    },
  });
}

/* export function usarUpdateUsuarioPW(id: string) {
  return useMutation({
    mutationFn: async (datosUsuario: DatosUsuarioPost): Promise<DatosUsuario> => {
      const { data } = await axios.patch(`${apiUrl}/pw/${id}`, datosUsuario, { headers });
      return transformarUsuario(data); 
    },
  });
} */
export function usarUpdateUsuarioResetearpw(id: string) {
  return useMutation({
    mutationFn: async (): Promise<DatosUsuario> => {
      const { data } = await axios.get(`${apiUrl}/resetearpw/${id}`, {
        headers,
      });
      return transformarUsuario(data);
    },
  });
}
export function usarUpdateUsuarioDarBaja(id: string) {
  return useMutation({
    mutationFn: async (): Promise<DatosUsuario> => {
      const { data } = await axios.get(`${apiUrl}/darbaja/${id}`, { headers });

      return transformarUsuario(data);
    },
  });
}
export function usarUpdateUsuarioDarAlta(id: string) {
  return useMutation({
    mutationFn: async (): Promise<DatosUsuario> => {
      const { data } = await axios.get(`${apiUrl}/daralta/${id}`, { headers });

      return transformarUsuario(data);
    },
  });
}

export function usarRemoveUsuario(id: string) {
  return useMutation({
    mutationFn: async (): Promise<DatosUsuario> => {
      const { data } = await axios.delete(`${apiUrl}/${id}`, { headers });

      return transformarUsuario(data);
    },
  });
}
