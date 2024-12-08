export interface DatosAsistencia {
  id: number;
  nombres: string;
  apellidos: string;
  ci: string;
  placa: string;
  propietario: string;
  grupo: string;
  nro: string;
  fecha_registro: string;
  [key: string]: any;
}
export interface DatosAsistenciaPostPacht {
  id_usuario: number;
}
