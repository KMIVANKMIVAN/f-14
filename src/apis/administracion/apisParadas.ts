import { DatosParada, DatosParadaPostPacht } from '@/interface/funcionalidades/interfasParadas';
import { obtenerDatosUsuario } from '@/utils/datosUsuarioLocalStor';
import { transformarParada } from '@/utils/transformarDatos/utilidades/transformarUsuarios';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';


const headers = {
  Authorization: `Bearer ${obtenerDatosUsuario()?.tk}`,
};
const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}paradas`;

export function usarPostParada() {
  return useMutation({
    mutationFn: async (datosParada: DatosParadaPostPacht): Promise<DatosParadaPostPacht> => {

      const { data } = await axios.post(`${apiUrl}/${obtenerDatosUsuario()?.id}`, datosParada, { headers });
      return transformarParada(data);

    },
  });
}
export function usarGetParadas() {
  return useQuery({
    queryKey: ['paradas'],
    queryFn: async (): Promise<DatosParada[]> => {
      const { data } = await axios.get(apiUrl, { headers });
      const paradas = data.map((parada: DatosParada) => transformarParada(parada));
      return paradas;
    },
  });
}
export function usarGetParadaFindOne(id: number) {
  return useQuery({
    queryKey: ['parada', id],
    queryFn: async (): Promise<DatosParada> => {
      const { data } = await axios.get(`${apiUrl}/${id}`, { headers });
      return transformarParada(data);

    },
  });
}
export function usarGetParadaFindOneInicioFinal(iniciofin: string, paradabus: string) {
  return useQuery({
    queryKey: ['parada', paradabus],
    queryFn: async (): Promise<DatosParada> => {
      const { data } = await axios.get(`${apiUrl}/poriniciofinal/${iniciofin}/${paradabus}`, { headers });
      return transformarParada(data);
    },
    // enabled: !!iniciofin && iniciofin.trim() !== "";
    enabled: !!paradabus && paradabus.trim() !== "",

  });
}

export function usarGetfindAllParadas(parada: string) {
  return useQuery({
    queryKey: ['paradas', parada],
    queryFn: async (): Promise<DatosParada[]> => {
      if (!parada || parada.trim() === "") {
        return [];
      }
      const { data } = await axios.get(`${apiUrl}/porparada/${parada}`, { headers });
      const paradas = data.map((parada: DatosParada) => transformarParada(parada));
      return paradas;
    },
    enabled: !!parada && parada.trim() !== "",
  });
}
export function usarUpdateParada(id: number) {
  return useMutation({
    mutationFn: async (datosParada: DatosParadaPostPacht): Promise<DatosParada> => {
      const { data } = await axios.patch(`${apiUrl}/${id}`, datosParada, { headers });
      return transformarParada(data);
    },
  });
}
export function usarRemoveParada(id: number) {
  return useMutation({
    mutationFn: async (): Promise<DatosParada> => {
      const { data } = await axios.delete(`${apiUrl}/${id}`, { headers });
      return transformarParada(data);

    }
  });
}