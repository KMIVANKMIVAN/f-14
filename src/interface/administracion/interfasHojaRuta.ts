export interface DatosHojaRuta {
  id: number;
  monto: number;
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
export interface DatosHojaRutaPostPacht {
  monto: number;
  id_usuario: number;
}
