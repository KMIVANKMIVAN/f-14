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
import { DatosGrupoPostPacht } from "@/interface/administracion/interfasGrupos";
import { manejoError } from "@/utils/mostrarErrores";
import { exitoToast } from "@/lib/notificaciones";
import useAbrirDialogCrearStore from "@/store/administracion/botonDialogCrear";
import useStoreTextoBuscar from "@/store/administracion/textoBuscarStor";
import { usarPostGrupo } from "@/apis/administracion/apisGrupos";

const formSchema = z.object({
  grupo: z.string().min(5, { message: "El grupo es demasiado corto." }),
  nro: z.string().min(1, { message: "El nro es demasiado corto." }),
});

export default function CrearMarcarParada() {
  const { setCerrarDialogCrear } = useAbrirDialogCrearStore();
  const { setTextoBuscarGrupoStory } = useStoreTextoBuscar();

  const { mutate: postGrupo, isSuccess, error, data } = usarPostGrupo();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grupo: "",
      nro: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const grupoPost: DatosGrupoPostPacht = {
      grupo: values.grupo,
      nro: values.nro,
    };

    postGrupo(grupoPost);
  }
  if (isSuccess) {
    setTextoBuscarGrupoStory("");
    setCerrarDialogCrear(false);
    exitoToast(`Se creó el grupo: ${data.grupo}`);
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
          name="grupo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grupo</FormLabel>
              <FormControl>
                <Input placeholder="grupo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nro"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NRO</FormLabel>
              <FormControl>
                <Input placeholder="nro" {...field} />
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
