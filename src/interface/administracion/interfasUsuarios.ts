import { DatosGrupo } from "./interfasGrupos";
import { DatosRol } from "./interfasRoles";
export interface DatosUsuario {
  id: number;
  nombres: string;
  apellidos: string;
  ci: string;
  complemento: string | null;
  correo: string | null;
  es_activo: string;
  se_cambiado_cntr: string;
  fecha_registro: string;
  fecha_actualizacion: string;
  registrador: string;
  id_rol: number;
  rol: DatosRol | null;

  placa: string;
  propietario: string;

  id_grupo: number;
  grupo: DatosGrupo | null;
}
export interface DatosUsuarioRol {
  id: number;
  nombres: string;
  apellidos: string;
  ci: string;
  complemento: string | null;
  correo: string | null;
  es_activo: string;
  se_cambiado_cntr: string;
  fecha_registro: string;
  fecha_actualizacion: string;
  registrador: string;
  id_rol: number;
  rol: string;

  placa: string;
  propietario: string;

  id_grupo: number;
  grupo: string;
}
export interface DatosUsuarioTk {
  tk: string;
  id: number;
  ci: string;
  camb_contra: boolean;
  es_activo: boolean;
  rol: DatosRol;
  iat: number;
  exp: number;
}
export interface DatosUsuarioPost {
  nombres: string;
  apellidos: string;
  ci: string;
  complemento: string | null;
  correo: string | null;
  id_rol: number;
  id_grupo: number;

  placa: string;
  propietario: boolean;
}
export interface DatosUsuarioPacht {
  nombres: string;
  apellidos: string;
  ci: string;
  complemento: string | null;
  correo: string | null;
  id_rol: number;
  id_grupo: number;

  placa: string;
  propietario: boolean;
}
export interface DatosUsuarioPachtPW {
  contrasenia: string;
}
export interface ActualizarUsuarioProps {
  nombres: string;
  apellidos: string;
  ci: string;
  complemento: string | null;
  correo: string | null;
  id_rol: number;
  id_grupo: number;
}

/* export interface DatosCIPlaca {
  id: number;
  nombreCompleto: string;
} */
export type DatosCIPlaca = Array<{ id: number; nombreCompleto: string }>;
