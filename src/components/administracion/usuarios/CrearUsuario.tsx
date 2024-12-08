"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { DatosUsuarioPost } from "@/interface/administracion/interfasUsuarios";
import { usarPostUsuario } from "@/apis/administracion/apisUsuarios";
import { manejoError } from "@/utils/mostrarErrores";
import { exitoToast } from "@/lib/notificaciones";
import { usarGetRoles } from "@/apis/administracion/apisRoles";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Cargando from "@/components/Cargando";
import useAbrirDialogCrearStore from "@/store/administracion/botonDialogCrear";
import useStoreTextoBuscar from "@/store/administracion/textoBuscarStor";
import { usarGetGrupos } from "@/apis/administracion/apisGrupos";

const formSchema = z.object({
  nombres: z.string().min(2, { message: "El nombre es demasiado corto." }),
  apellidos: z.string().min(2, { message: "El apellido es demasiado corto." }),
  correo: z
    .string()
    .email({ message: "Correo inválido." })
    .or(z.literal(""))
    .optional(),
  ci: z.string().min(7, { message: "El CI debe tener al menos 7 caracteres." }),
  complemento: z.string().optional(),
  id_rol: z.string().nonempty({ message: "El rol es requerido." }),
  id_grupo: z.string().nonempty({ message: "El grupo es requerido." }),

  placa: z
    .string()
    .length(8, { message: "La placa debe tener exactamente 8 caracteres." }),
  propietario: z.string().min(2, { message: "El propietario es muy corto." }),
});

export default function CrearUsuario() {
  const { setCerrarDialogCrear } = useAbrirDialogCrearStore();
  const { setTextoBuscarUsuarioStory } = useStoreTextoBuscar();
  const {
    mutate: postUsuario,
    isSuccess,
    error,
    data: usuarios,
  } = usarPostUsuario();
  const {
    data: roles,
    isLoading: rolesLoading,
    error: rolesError,
  } = usarGetRoles();
  const {
    data: grupos,
    isLoading: gruposLoading,
    error: gruposError,
  } = usarGetGrupos();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      correo: "",
      ci: "",
      complemento: "",
      id_rol: "",
      id_grupo: "",
      placa: "",
      propietario: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const usuarioPost: DatosUsuarioPost = {
      nombres: values.nombres,
      apellidos: values.apellidos,
      correo: values.correo || null,
      ci: values.ci,

      placa: values.placa,
      propietario: values.propietario === "true" ? true : false,

      complemento: values.complemento || null,
      id_rol: Number(values.id_rol),
      id_grupo: Number(values.id_grupo),
    };

    postUsuario(usuarioPost);
  }

  if (isSuccess) {
    setTextoBuscarUsuarioStory("");
    setCerrarDialogCrear(false);
    exitoToast(`Se creó el usuario: ${usuarios.nombres}`);
  }
  if (error) manejoError(error);

  if (rolesLoading) return <Cargando />;
  if (rolesError) manejoError(error);
  if (gruposLoading) return <Cargando />;
  if (gruposError) manejoError(error);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md mx-auto space-y-8"
      >
        <FormField
          control={form.control}
          name="nombres"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombres</FormLabel>
              <FormControl>
                <Input
                  className="capitalize"
                  placeholder="nombres"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="apellidos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellidos</FormLabel>
              <FormControl>
                <Input
                  className="capitalize"
                  placeholder="apellidos"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <FormField
              control={form.control}
              name="correo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo</FormLabel>
                  <FormControl>
                    <Input
                      className="capitalize"
                      placeholder="correo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <FormField
              control={form.control}
              name="ci"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CI</FormLabel>
                  <FormControl>
                    <Input className="uppercase" placeholder="ci" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full  group">
            <FormField
              control={form.control}
              name="propietario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Propietario</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Es Propietario?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Propietario</SelectLabel>
                          <SelectItem value="true">Sí</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="relative z-0 w-full  group">
            <FormField
              control={form.control}
              name="placa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placa</FormLabel>
                  <FormControl>
                    <Input
                      className="uppercase"
                      placeholder="Ej: 1234 QWE"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full  group">
            <FormField
              control={form.control}
              name="complemento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    {/* <Select
                      value={field.value || ""}
                      onValueChange={(value) => field.onChange(value)}
                      onBlur={field.onBlur}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar Complemento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Complementos</SelectLabel>
                          <SelectItem value="LP">LP</SelectItem>
                          <SelectItem value="CH">CH</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select> */}
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar Complemento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Complementos</SelectLabel>
                          <SelectItem value="LP">LP</SelectItem>
                          <SelectItem value="CH">CH</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="relative z-0 w-full  group">
            <FormField
              control={form.control}
              name="id_rol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar Rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Roles</SelectLabel>
                          {roles ? (
                            roles.map((role) => (
                              <SelectItem
                                key={role.id}
                                value={role.id.toString()}
                              >
                                {role.rol}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="">
                              No hay roles disponibles
                            </SelectItem>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <FormField
              control={form.control}
              name="id_grupo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grupo</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar Grupo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Grupos</SelectLabel>
                          {grupos ? (
                            grupos.map((grupo) => (
                              <SelectItem
                                key={grupo.id}
                                value={grupo.id.toString()}
                              >
                                {grupo.grupo}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="">
                              No hay grupos disponibles
                            </SelectItem>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="relative z-0 w-full mb-5 group"></div>
        </div>
        <Button variant="flat5" type="submit">
          Crear
        </Button>
      </form>
    </Form>
  );
}
