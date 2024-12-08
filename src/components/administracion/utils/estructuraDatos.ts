import { DatosParada, DatosParadaKeys } from "@/interface/funcionalidades/interfasParadas";

export const columnasUsuarios = [
  { id: 'acciones', label: '' },
  { id: 'id', label: 'ID' },
  { id: 'es_activo', label: 'es activo' },
  { id: 'nombres', label: 'nombres' },
  { id: 'apellidos', label: 'apellidos' },
  { id: 'ci', label: 'ci' },
  { id: 'grupo', label: 'grupo' },
  { id: 'propietario', label: 'es propietario' },
  { id: 'registrador', label: 'registrado por' },
  { id: 'placa', label: 'placa' },
  { id: 'correo', label: 'correo' },
  { id: 'fecha_registro', label: 'fecha registro' },
  { id: 'fecha_actualizacion', label: 'fecha actualizacion' },
  { id: 'rol', label: 'rol' },
  { id: 'complemento', label: 'complemento' },
  { id: 'se_cambiado_cntr', label: 'pw por defecto' },
];
export const columnasRoles = [
  { id: 'acciones', label: '' },
  { id: 'id', label: 'ID' },
  { id: 'rol', label: 'rol' },
];
/* export const columnasParadas = [
  { id: 'acciones', label: '' },
  { id: 'id', label: 'ID' },
  { id: 'parada', label: 'parada' },
  { id: 'tipo', label: 'tipo' },
  { id: 'latitud', label: 'latitud' },
  { id: 'longitud', label: 'longitud' },
  { id: 'fecha_registro', label: 'fecha registro' },
  { id: 'fecha_actualizacion', label: 'fecha actualizacion' },
]; */
export const columnasParadas: Array<{ id: keyof DatosParada | 'acciones'; label: string }> = [
  { id: 'acciones', label: '' },
  { id: 'id', label: 'ID' },
  { id: 'parada', label: 'parada' },
  { id: 'tipo', label: 'tipo' },
  { id: 'latitud', label: 'latitud' },
  { id: 'longitud', label: 'longitud' },
  { id: 'fecha_registro', label: 'fecha registro' },
  { id: 'fecha_actualizacion', label: 'fecha actualizacion' },
];
export const columnasGrupos = [
  { id: 'acciones', label: '' },
  { id: 'id', label: 'ID' },
  { id: 'grupo', label: 'grupo' },
  { id: 'nro', label: 'nro' },
  { id: 'fecha_registro', label: 'fecha registro' },
  { id: 'fecha_actualizacion', label: 'fecha actualizacion' },
];
export const columnasMarcarParadas = [
  { id: 'acciones', label: '' },
  { id: 'id', label: 'ID' },
  { id: 'tipo', label: 'tipo' },
  { id: 'tipo_parada', label: 'zona parada' },
  { id: 'parada', label: 'parada' },
  { id: 'propietario', label: 'es propietario' },
  { id: 'nombres', label: 'nombres' },
  { id: 'apellidos', label: 'apellidos' },
  { id: 'ci', label: 'ci' },
  { id: 'placa', label: 'placa' },
  { id: 'grupo', label: 'grupo' },
  { id: 'nro', label: 'nro' },
  { id: 'fecha_registro', label: 'fecha registro' },
];
export const columnasHojaRutas = [
  { id: 'acciones', label: '' },
  { id: 'id', label: 'ID' },
  { id: 'monto', label: 'monto' },
  { id: 'propietario', label: 'es propietario' },
  { id: 'nombres', label: 'nombres' },
  { id: 'apellidos', label: 'apellidos' },
  { id: 'ci', label: 'ci' },
  { id: 'placa', label: 'placa' },
  { id: 'grupo', label: 'grupo' },
  { id: 'nro', label: 'nro' },
  { id: 'fecha_registro', label: 'fecha registro' },
];
export const columnasAsistencias = [
  { id: 'acciones', label: '' },
  { id: 'id', label: 'ID' },
  { id: 'fecha_registro', label: 'fecha registro' },
  { id: 'propietario', label: 'es propietario' },
  { id: 'nombres', label: 'nombres' },
  { id: 'apellidos', label: 'apellidos' },
  { id: 'ci', label: 'ci' },
  { id: 'placa', label: 'placa' },
  { id: 'grupo', label: 'grupo' },
  { id: 'nro', label: 'nro' },
];
