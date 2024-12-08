"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, X } from "lucide-react";
import { exitoToast } from "@/lib/notificaciones";
import { manejoError } from "@/utils/mostrarErrores";
import { usarGetUsuariosFindAllCIPlaca } from "@/apis/administracion/apisUsuarios";
import { DatosHojaRutaPostPacht } from "@/interface/administracion/interfasHojaRuta";
import { usarPostHojaRuta } from "@/apis/funcionalidades/apisHojaRutas";

const formSchema = z.object({
  monto: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Ingrese un monto válido con hasta 2 decimales.",
  }),
  id_usuario: z.string().optional().default(""),
});

export default function DialogCrearHojaRuta() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cioplaca, setCioplaca] = useState(""); // Estado para almacenar la entrada de búsqueda
  const { mutate: postHojaRuta, isSuccess, error, data } = usarPostHojaRuta();
  const {
    data: usuarios,
    isLoading: usuariosLoading,
    error: usuariosError,
  } = usarGetUsuariosFindAllCIPlaca(cioplaca);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monto: "",
      id_usuario: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const hojaRutaPost: DatosHojaRutaPostPacht = {
      monto: parseFloat(values.monto), // Convertir el monto a decimal
      id_usuario: parseInt(values.id_usuario, 10), // Convertir id_usuario a número
    };

    postHojaRuta(hojaRutaPost);
  }
  const { reset } = form;
  // Utiliza useEffect para manejar el éxito del post
  useEffect(() => {
    if (isSuccess) {
      setIsDialogOpen(false);
      exitoToast(`Se creó el registro con el monto: ${data.monto}`);
      reset(); // Resetea el formulario después de un envío exitoso
      setCioplaca(""); // Resetea el campo de búsqueda
    }
  }, [isSuccess, data, reset]);

  if (error) manejoError(error);

  const dialogCerrar = () => {
    setIsDialogOpen(false);
  };

  return (
    <div>
      <Button
        variant="flat5"
        className="w-full md:w-auto flex items-center justify-center"
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus className="h-3.5 w-3.5 mr-2" />
        Registrar Compra
      </Button>
      {isDialogOpen && (
        <div
          id="modal-overlay"
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={dialogCerrar}
        >
          <div
            id="static-modal"
            tabIndex={-1}
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="px-4 md:px-0 relative py-2 w-full max-w-xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700 overflow-y-auto"
              style={{ maxHeight: "90vh" }}
            >
              <div className="flex items-center justify-between md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Registrar Compra
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={dialogCerrar}
                >
                  <X />
                </button>
              </div>
              <div className="py-7">
                <div className="max-w-md mx-auto space-y-8">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="simple-search"
                      value={cioplaca}
                      onChange={(e) => setCioplaca(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Buscar por CI o Placa"
                    />
                  </div>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="max-w-md mx-auto space-y-8"
                    >
                      <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="relative z-0 w-full mb-5 group">
                          <FormField
                            control={form.control}
                            name="id_usuario"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>usuario</FormLabel>
                                <FormControl>
                                  <Select
                                    value={field.value || ""}
                                    onValueChange={(value) =>
                                      field.onChange(value)
                                    }
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Seleccione un usuario" />
                                    </SelectTrigger>
                                    {usuarios && usuarios.length > 0 ? (
                                      <SelectContent>
                                        <SelectGroup>
                                          <SelectLabel>Usuarios</SelectLabel>
                                          {usuarios.map((usuario) => (
                                            <SelectItem
                                              key={usuario.id}
                                              value={usuario.id.toString()}
                                            >
                                              {usuario.nombreCompleto}
                                            </SelectItem>
                                          ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    ) : (
                                      <p className="p-2 text-gray-500">
                                        No hay usuarios disponibles
                                      </p>
                                    )}
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                          <FormField
                            control={form.control}
                            name="monto"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Monto</FormLabel>
                                <FormControl>
                                  <Input placeholder="monto" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <Button variant="flat5" type="submit">
                        Crear
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
