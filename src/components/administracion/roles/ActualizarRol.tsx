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
import { DatosRolPost } from "@/interface/administracion/interfasRoles";
import { manejoError } from "@/utils/mostrarErrores";
import { exitoToast } from "@/lib/notificaciones";
import useAbrirDialogStore from "@/store/administracion/botonDialogActuali";
import useStoreTextoBuscar from "@/store/administracion/textoBuscarStor";
import { usarUpdateRol } from "@/apis/administracion/apisRoles";

interface ActualizarRolProps {
  idColumna: number;
  respuestaActualizar: {
    rol: string;
  };
}

const formSchema = z.object({
  rol: z.string().min(2, { message: "El rol es demasiado corto." }),
});

export default function ActualizarRol({
  idColumna,
  respuestaActualizar,
}: ActualizarRolProps) {
  const { setCerrarDialogActualiAdmin } =
    useAbrirDialogStore();
  const { setTextoBuscarRolStory } = useStoreTextoBuscar();
  const {
    mutate: updateRol,
    isSuccess,
    error,
    data,
  } = usarUpdateRol(idColumna);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rol: respuestaActualizar.rol,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const rolPacht: DatosRolPost = {
      rol: values.rol,
    };

    updateRol(rolPacht);
  }

  if (isSuccess) {
    setTextoBuscarRolStory("");
    exitoToast(`Se actualizó el rol: ${data.rol}`);
    setCerrarDialogActualiAdmin(true);
  }
  if (error) manejoError(error);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md mx-auto space-y-8"
      >
        <FormField
          control={form.control}
          name="rol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <FormControl>
                <Input placeholder="rol" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="flat5" type="submit">
          Actualizar
        </Button>
      </form>
    </Form>
  );
}
