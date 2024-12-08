export interface DatosMarcarParada {
  id: number;
  tipo: string;
  nombres: string;
  apellidos: string;
  ci: string;
  placa: string;
  propietario: string;
  grupo: string;
  nro: string;
  fecha_registro: string;
  parada: string;
  tipo_parada: string;
  [key: string]: any;
}
export interface DatosMarcarParadaPostPacht {
  tipo: string;
  id_usuario: number;
}

export interface ParamsRangoFechasYGrupo {
  fechainicio: string;
  fechafin: string;
  id_grupo: number;
  param?: string; // Puede ser CI o Placa
}