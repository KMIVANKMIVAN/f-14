import { DatosUsuario, DatosUsuarioRol } from "@/interface/administracion/interfasUsuarios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
export const transformarUsuarioRolGrupo = (usuario: DatosUsuario): DatosUsuarioRol => {
  
  
  return {
    id: usuario.id,
    nombres: usuario.nombres,
    apellidos: usuario.apellidos,
    ci: usuario.ci,
    complemento: usuario.complemento,
    correo: usuario.correo,
    registrador: usuario.registrador,

    propietario: usuario.propietario ? "Sí" : "No", 
    placa: usuario.placa,

    es_activo: usuario.es_activo ? "Sí" : "No", 
    se_cambiado_cntr: usuario.se_cambiado_cntr ? "No" : "Sí", 
    fecha_registro: dayjs(usuario.fecha_registro)
      .tz("America/La_Paz")
      .format("DD/MM/YYYY HH:mm"), 
    fecha_actualizacion: dayjs(usuario.fecha_actualizacion)
      .tz("America/La_Paz")
      .format("DD/MM/YYYY HH:mm"),
    rol: usuario.rol ? usuario.rol.rol : "", 
    id_rol: usuario.id_rol,
    grupo: usuario.grupo ? usuario.grupo.grupo : "", 
    id_grupo: usuario.id_grupo 
  };
};
export const transformarUsuario = (usuario: DatosUsuario): DatosUsuario => {
  return {
    ...usuario,
    fecha_registro: dayjs(usuario.fecha_registro)
      .tz("America/La_Paz")
      .format("DD/MM/YYYY HH:mm"), 
    fecha_actualizacion: dayjs(usuario.fecha_actualizacion)
      .tz("America/La_Paz")
      .format("DD/MM/YYYY HH:mm"), 
    es_activo: usuario.es_activo ? "Sí" : "No", 
    se_cambiado_cntr: usuario.se_cambiado_cntr ? "No" : "Sí", 
    propietario: usuario.propietario ? "Sí" : "No", 
    placa: usuario.placa,
  };
};