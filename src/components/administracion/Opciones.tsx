"use client";
import { useState, useEffect } from "react";
import { Ellipsis } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import DialogActualizar from "./DialogActualizar";
import useAbrirDialogStore from "@/store/administracion/botonDialogActuali";

interface OpcionesProps {
  idColumna: number;
  accionCompo: string;
  respuestaActualizar: { [key: string]: any };
}

export default function Opciones({
  idColumna,
  accionCompo,
  respuestaActualizar,
}: OpcionesProps) {
  const { cerrarDialogActualiAdmin, setCerrarDialogActualiAdmin } =
    useAbrirDialogStore();
  const [dialogAbrirAbrirAcualizar, setDialogAbrirAcualizar] = useState(false);
  const [desSeleccionar, setDesSeleccionar] = useState<string | null>(null);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (cerrarDialogActualiAdmin) {
      setDialogAbrirAcualizar(false);
      setCerrarDialogActualiAdmin(false);
    }
  }, [cerrarDialogActualiAdmin, setCerrarDialogActualiAdmin]);

  let opciones = ["actualizar", "eliminar"];
  if (accionCompo === "usuarios") {
    const estadoActivo =
      respuestaActualizar.es_activo === "Sí" ? "dar baja" : "dar alta";
    opciones = [...opciones, estadoActivo, "recetear contraseña"];
  }

  const manejarOpcionCambiar = (value: string) => {
    setOpcionSeleccionada(value);
    setDialogAbrirAcualizar(true);

    setTimeout(() => {
      // setDesSeleccionar(null);
      setDesSeleccionar("");
    }, 100);
  };

  return (
    <div className="flex items-center space-x-3 w-10">
      <Select
        // value={desSeleccionar ?? undefined}
        value={desSeleccionar || ""}
        onValueChange={manejarOpcionCambiar}
      >
        <SelectTrigger className="w-[180px]">
          <Ellipsis className="w-5 h-5" />
        </SelectTrigger>
        <SelectContent className="capitalize">
          {opciones.map((opcion, index) => (
            <SelectItem key={index} value={opcion}>
              {opcion}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {dialogAbrirAbrirAcualizar && (
        <DialogActualizar
          idColumna={idColumna}
          accionCompo={accionCompo}
          respuestaActualizar={respuestaActualizar}
          dialogActCerrar={() => setDialogAbrirAcualizar(false)}
          elimiResetAltaBaja={opcionSeleccionada ?? ""}
        />
      )}
    </div>
  );
}
