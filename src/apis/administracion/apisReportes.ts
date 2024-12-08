import { DatosGrupo, DatosGrupoPostPacht } from '@/interface/administracion/interfasGrupos';
import { obtenerDatosUsuario } from '@/utils/datosUsuarioLocalStor';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

const headers = {
  Authorization: `Bearer ${obtenerDatosUsuario()?.tk}`,
};
const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}reportes`;


export function verPdfActivacionCuenta(url: string, usuario: string, contrasena: string) {
  const endpoint = `${apiUrl}/view?url=${encodeURIComponent(url)}&usuario=${encodeURIComponent(usuario)}&contrasena=${encodeURIComponent(contrasena)}`;

  axios.get(endpoint, { headers, responseType: 'blob' })
    .then((response) => {
      const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(fileURL, '_blank');
    })
    .catch((error) => {
      console.error('Error al visualizar el PDF:', error);
    });
}

// Función para descargar el PDF
export function descargarPdfActivacionCuenta(url: string, usuario: string, contrasena: string) {
  const endpoint = `${apiUrl}/download?url=${encodeURIComponent(url)}&usuario=${encodeURIComponent(usuario)}&contrasena=${encodeURIComponent(contrasena)}`;

  axios.get(endpoint, { headers, responseType: 'blob' })
    .then((response) => {
      const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = fileURL;
      a.download = 'activacion_cuenta.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
    .catch((error) => {
      console.error('Error al descargar el PDF:', error);
    });
}

/* export function usarPostGrupo() {
  return useMutation({
    mutationFn: async (datosGrupo: DatosGrupoPostPacht): Promise<DatosGrupo> => {
      const { data } = await axios.post(apiUrl, datosGrupo, { headers });
      return data;
    },
  });
} */
/* export function usarGetGrupoFindOne(id: number) {
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
} */