export interface DatosParada {
  id: number;
  parada: string;
  tipo: string;
  latitud: string;
  longitud: string;
  fecha_registro: string;
  fecha_actualizacion: string;
  registrador: string;
}

export interface DatosParadaPostPacht {
  parada: string;
  tipo: string;
  latitud: string;
  longitud: string;
}

export type DatosParadaKeys = keyof DatosParada;
