"use client";
import { useEffect, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Circle as CircleGeom } from "ol/geom";
import Feature from "ol/Feature";
import { Style, Fill, Stroke } from "ol/style";
import { Button } from "@/components/ui/button";
import { ChevronFirst, ChevronLast } from "lucide-react";
import { z } from "zod";
import { usarUpdateParada } from "@/apis/administracion/apisParadas";
import { zodResolver } from "@hookform/resolvers/zod";
import { exitoToast } from "@/lib/notificaciones";
import { manejoError } from "@/utils/mostrarErrores";
import { DatosParadaPostPacht } from "@/interface/funcionalidades/interfasParadas";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import refrescarAdminParadaStore from "@/store/administracion/refrescarAdminParada";

const formSchema = z.object({
  parada: z.string().min(3, { message: "La parada es demasiado corta." }),
  tipo: z.string().min(3, { message: "El tipo es demasiado corto." }),
});

interface ActualizarParadaProps {
  idColumna: number;
  respuestaActualizar: {
    parada: string;
    tipo: string;
    latitud: string;
    longitud: string;
  };
}

export default function ActualizarParada({
  idColumna,
  respuestaActualizar,
}: ActualizarParadaProps) {
  const { incrementar } = refrescarAdminParadaStore();

  const centroLat = -16.49544262172246;
  const centroLon = -68.15169746254303;
  const zurtLat = -16.536545350668177;
  const zurtLon = -68.04589487795359;

  const {
    mutate: pachtParada,
    isSuccess,
    error,
    data,
  } = usarUpdateParada(idColumna);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parada: respuestaActualizar.parada,
      tipo: respuestaActualizar.tipo,
      latitud: respuestaActualizar.latitud, // Valor inicial
      longitud: respuestaActualizar.longitud, // Valor inicial
    },
  });

  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number }>({
    lat: Number(respuestaActualizar.latitud),
    lon: Number(respuestaActualizar.longitud),
  });

  const [map, setMap] = useState<Map | null>(null);
  const [vectorSource, setVectorSource] = useState(new VectorSource());

  useEffect(() => {
    const initialMap = new Map({
      target: "mapContainer",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([coordinates.lon, coordinates.lat]),
        zoom: 16,
      }),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    initialMap.addLayer(vectorLayer);

    setMap(initialMap);

    return () => {
      initialMap.setTarget(undefined);
    };
  }, [vectorSource]);

  // Actualizar el círculo en el mapa y los valores del formulario
  /* useEffect(() => {
    if (!map || !coordinates.lat || !coordinates.lon) return;

    const selectedPoint = fromLonLat([coordinates.lon, coordinates.lat]);
    const circleFeature = new Feature({
      geometry: new CircleGeom(selectedPoint, 100),
    });

    circleFeature.setStyle(
      new Style({
        stroke: new Stroke({
          color: "rgba(255, 0, 0, 1)",
          width: 2,
        }),
        fill: new Fill({
          color: "rgba(255, 0, 0, 0.2)",
        }),
      })
    );

    vectorSource.clear();
    vectorSource.addFeature(circleFeature);

    map.getView().fit(circleFeature.getGeometry().getExtent(), {
      duration: 1000,
      maxZoom: 16,
    });

    // Actualizar los valores de latitud y longitud en el formulario
    form.setValue("latitud", coordinates.lat);
    form.setValue("longitud", coordinates.lon);
  }, [coordinates, map, form]); */
  useEffect(() => {
    if (!map || !coordinates.lat || !coordinates.lon) return;

    const selectedPoint = fromLonLat([coordinates.lon, coordinates.lat]);
    const circleFeature = new Feature({
      geometry: new CircleGeom(selectedPoint, 100),
    });

    circleFeature.setStyle(
      new Style({
        stroke: new Stroke({
          color: "rgba(255, 0, 0, 1)",
          width: 2,
        }),
        fill: new Fill({
          color: "rgba(255, 0, 0, 0.2)",
        }),
      })
    );

    vectorSource.clear();
    vectorSource.addFeature(circleFeature);

    if (map) {
      // Verifica que map esté definido
      const geometry = circleFeature.getGeometry();
      if (geometry) {
        // Verifica que la geometría también esté definida
        map.getView().fit(geometry.getExtent(), {
          duration: 1000,
          maxZoom: 16,
        });
      }
    }

    // Actualizar los valores de latitud y longitud en el formulario
    form.setValue("latitud", coordinates.lat.toString());
    form.setValue("longitud", coordinates.lon.toString());
  }, [coordinates, map, form]);

  const handleMapClick = (event: any) => {
    if (!map) return;
    const [lon, lat] = toLonLat(event.coordinate);
    setCoordinates({ lat, lon });
  };

  useEffect(() => {
    if (!map) return;

    map.on("click", handleMapClick);

    return () => {
      map.un("click", handleMapClick);
    };
  }, [map]);

  const goToCentro = () => {
    setCoordinates({ lat: centroLat, lon: centroLon });
  };

  const goToZonaSur = () => {
    setCoordinates({ lat: zurtLat, lon: zurtLon });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const paradaPacht: DatosParadaPostPacht = {
      parada: values.parada,
      tipo: values.tipo,
      latitud: coordinates.lat.toString(), // Asegúrate de usar los valores actualizados
      longitud: coordinates.lon.toString(),
    };

    pachtParada(paradaPacht);
  }

  useEffect(() => {
    if (isSuccess) {
      exitoToast(`Se actualizo la parada: ${data.parada}`);
      incrementar();
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (error) {
      manejoError(error);
      // Aquí podrías restablecer el estado de error si es necesario
    }
  }, [error]);

  return (
    <div>
      <p className="mb-4 mt-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-2xl dark:text-white">
        Actualizar Parada {respuestaActualizar.parada} <br />
        {/* Actualizar Parada {respuestaActualizar.tipo} <br /> */}
        {/* Actualizar Parada {respuestaActualizar.latitud} <br /> */}
        {/* Actualizar Parada {respuestaActualizar.longitud} */}
      </p>
      <div className="m-4">
        <div
          id="mapContainer"
          className="w-full h-96 shadow-2xl"
          style={{ borderRadius: "10px", overflow: "hidden" }}
        />
        <div className="flex justify-between mt-4">
          <Button variant="flat5" onClick={goToCentro}>
            <ChevronFirst />
            Centro
          </Button>
          <Button variant="flat5" onClick={goToZonaSur}>
            Zona sur <ChevronLast />
          </Button>
        </div>
      </div>

      {coordinates.lat && coordinates.lon && (
        <div>
          <div className="p-4 shadow-2xl rounded-md dark:bg-gray-800">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <div className="grid md:grid-cols-2 md:gap-6">
                  <div className="relative z-0 w-full mb-5 group">
                    <FormField
                      control={form.control}
                      name="parada"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de la Parada</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ingrese el nombre de la parada"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tipo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Parada</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ingrese el tipo de parada"
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
                      name="latitud"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitud</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="longitud"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitud</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <Button variant="flat5" type="submit">
                  Actualizar
                </Button>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
