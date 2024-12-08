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
import { manejoError } from "@/utils/mostrarErrores";
import { exitoToast } from "@/lib/notificaciones";
import useAbrirDialogStore from "@/store/administracion/botonDialogActuali";
import useStoreTextoBuscar from "@/store/administracion/textoBuscarStor";
import { DatosGrupoPostPacht } from "@/interface/administracion/interfasGrupos";
import { usarUpdateGrupo } from "@/apis/administracion/apisGrupos";

interface ActualizarGrupoProps {
  idColumna: number;
  respuestaActualizar: {
    grupo: string;
    nro: string;
  };
}

const formSchema = z.object({
  grupo: z.string().min(5, { message: "El grupo es demasiado corto." }),
  nro: z.string().min(1, { message: "El nro es demasiado corto." }),
});

export default function ActualizarGrupo({
  idColumna,
  respuestaActualizar,
}: ActualizarGrupoProps) {
  const { setCerrarDialogActualiAdmin } = useAbrirDialogStore();
  const { setTextoBuscarGrupoStory } = useStoreTextoBuscar();
  const {
    mutate: updateRol,
    isSuccess,
    error,
    data,
  } = usarUpdateGrupo(idColumna);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grupo: respuestaActualizar.grupo,
      nro: respuestaActualizar.nro,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const grupoPacht: DatosGrupoPostPacht = {
      grupo: values.grupo,
      nro: values.nro,
    };

    updateRol(grupoPacht);
  }

  if (isSuccess) {
    setTextoBuscarGrupoStory("");
    exitoToast(`Se actualizó el grupo: ${data.grupo}`);
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
          Actualizar
        </Button>
      </form>
    </Form>
  );
}
