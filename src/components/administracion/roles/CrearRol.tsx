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
import { usarPostRol } from "@/apis/administracion/apisRoles";
import { manejoError } from "@/utils/mostrarErrores";
import { exitoToast } from "@/lib/notificaciones";
import useAbrirDialogCrearStore from "@/store/administracion/botonDialogCrear";
import useStoreTextoBuscar from "@/store/administracion/textoBuscarStor";

const formSchema = z.object({
  rol: z.string().min(2, { message: "El rol es demasiado corto." }),
});

export default function CrearRol() {
  const { setCerrarDialogCrear } = useAbrirDialogCrearStore();
  const { setTextoBuscarRolStory } = useStoreTextoBuscar();

  const { mutate: postRol, isSuccess, error, data } = usarPostRol();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rol: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const rolPost: DatosRolPost = {
      rol: values.rol,
    };

    postRol(rolPost);
  }
  if (isSuccess) {
    setTextoBuscarRolStory("");
    setCerrarDialogCrear(false);
    exitoToast(`Se creó el rol: ${data.rol}`);
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
          Crear
        </Button>
      </form>
    </Form>
  );
}
