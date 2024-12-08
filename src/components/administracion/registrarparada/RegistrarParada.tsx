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
import { usarPostParada } from "@/apis/administracion/apisParadas";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  parada: z.string().min(3, { message: "La parada es demasiado corta." }),
  tipo: z.string().min(3, { message: "El tipo es demasiado corto." }),
});

export default function RegistrarParada() {
  // Coordenadas iniciales predefinidas
  const centroLat = -16.49544262172246;
  const centroLon = -68.15169746254303;
  const zurtLat = -16.536545350668177;
  const zurtLon = -68.04589487795359;

  // Hook para manejar la mutación (POST) de la parada
  const { mutate: postParada, isSuccess, error, data } = usarPostParada();

  // Configuración inicial del formulario con valores predeterminados
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parada: "",
      tipo: "",
      latitud: centroLat, // Valor inicial
      longitud: centroLon, // Valor inicial
    },
  });

  const { reset } = form; // Permite restablecer el formulario

  // Estado para manejar las coordenadas seleccionadas
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number }>({
    lat: centroLat,
    lon: centroLon,
  });

  // Referencia al objeto del mapa
  const [map, setMap] = useState<Map | null>(null);

  // Fuente vectorial para las geometrías dibujadas en el mapa
  const [vectorSource, setVectorSource] = useState(new VectorSource());

  // Inicialización del mapa y configuración inicial
  useEffect(() => {
    const initialMap = new Map({
      target: "mapContainer", // Div donde se renderiza el mapa
      layers: [
        new TileLayer({
          source: new OSM(), // Fuente: OpenStreetMap
        }),
      ],
      view: new View({
        center: fromLonLat([coordinates.lon, coordinates.lat]), // Centro inicial basado en coordenadas
        zoom: 16, // Nivel de zoom inicial
      }),
    });

    // Capa vectorial para dibujar elementos en el mapa
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    initialMap.addLayer(vectorLayer);

    setMap(initialMap);// Guardamos la referencia del mapa en el estado

    // Limpiamos el mapa al desmontar el componente
    return () => {
      initialMap.setTarget(undefined);
    };
  }, [vectorSource]);

  // Efecto para actualizar el mapa al cambiar las coordenadas
  useEffect(() => {
    if (!map || !coordinates.lat || !coordinates.lon) return;

    // Convertimos las coordenadas seleccionadas a la proyección del mapa
    const selectedPoint = fromLonLat([coordinates.lon, coordinates.lat]);

    // Creamos un círculo con un radio de 100 metros
    const circleFeature = new Feature({
      geometry: new CircleGeom(selectedPoint, 100),
    });

    // Aplicamos estilo al círculo
    circleFeature.setStyle(
      new Style({
        stroke: new Stroke({
          color: "rgba(255, 0, 0, 1)", // Borde rojo
          width: 2, // Ancho del borde
        }),
        fill: new Fill({
          color: "rgba(255, 0, 0, 0.2)", // Relleno semitransparente rojo
        }),
      })
    );

    vectorSource.clear(); // Limpiamos las geometrías anteriores
    vectorSource.addFeature(circleFeature); // Agregamos el nuevo círculo

    // Verificar que tanto map, getView, como el geometry estén definidos
    const view = map.getView();
    const geometry = circleFeature.getGeometry();

    // Ajustamos el mapa para centrarlo en la geometría
    if (view && geometry) {
      view.fit(geometry.getExtent(), {
        duration: 1000, // Animación de ajuste de 1 segundo
        maxZoom: 16,
      });
    }

    // Actualizar los valores de latitud y longitud en el formulario
    form.setValue("latitud", coordinates.lat);
    form.setValue("longitud", coordinates.lon);
  }, [coordinates, map, form]);

  // Manejador para capturar clics en el mapa
  const handleMapClick = (event: any) => {
    if (!map) return;
    const [lon, lat] = toLonLat(event.coordinate); // Convertimos las coordenadas del clic
    setCoordinates({ lat, lon }); // Actualizamos el estado de coordenadas
  };

  // Vinculamos el evento de clic en el mapa al montarse el componente
  useEffect(() => {
    if (!map) return;

    map.on("click", handleMapClick); // Agregamos el evento

    return () => {
      map.un("click", handleMapClick); // Eliminamos el evento al desmontar
    };
  }, [map]);

  // Función para centrar el mapa en la ubicación del "Centro"
  const goToCentro = () => {
    setCoordinates({ lat: centroLat, lon: centroLon });
  };

  // Función para centrar el mapa en la "Zona Sur"
  const goToZonaSur = () => {
    setCoordinates({ lat: zurtLat, lon: zurtLon });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const paradaPost: DatosParadaPostPacht = {
      parada: values.parada,
      tipo: values.tipo,
      latitud: coordinates.lat.toString(),
      longitud: coordinates.lon.toString(),
    };

    postParada(paradaPost);
  }

  useEffect(() => {
    if (isSuccess) {
      exitoToast(`Se creó la parada: ${data.parada}`);
      reset(); // Resetear los campos del formulario al éxito
    }
  }, [isSuccess, data, reset]);

  useEffect(() => {
    if (error) {
      manejoError(error);
    }
  }, [error]);

  return (
    <div>
      <p className="mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-2xl dark:text-white">
        Registrar Parada
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
                            <Select
                              value={field.value || ""}
                              onValueChange={(value) => {
                                field.onChange(value);
                                field.onBlur(); // Llama a onBlur manualmente aquí
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Tipo</SelectLabel>
                                  <SelectItem value="Zona Sur">
                                    zona sur
                                  </SelectItem>
                                  <SelectItem value="Zona Central">
                                    zona central
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
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
                  Crear
                </Button>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
