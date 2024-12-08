import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {

  const cookies = request.cookies.get('datosUsuario');

  if (!cookies) {

    return NextResponse.redirect(new URL('/', request.url))
  }

  const datosUsuario = JSON.parse(cookies.value);

  const token = datosUsuario.tk;
  const usuarioRol = datosUsuario.rol?.rol;

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const protegerAdminRutas = ['/panel/administracion/usuarios', '/panel/administracion', '/panel/administracion/reportes'];
  const rutaActual = new URL(request.url).pathname;

  if (protegerAdminRutas.includes(rutaActual) && usuarioRol !== 'Administrador') {
    return NextResponse.redirect(new URL('/panel/noautorizado', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/panel/administracion/usuarios', '/panel/administracion', '/panel/administracion/reportes', '/panel/marcarparda/final', '/panel/marcarparda/inicio'],
}
