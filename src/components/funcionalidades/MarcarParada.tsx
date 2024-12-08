"use client";
import { useEffect, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Circle as CircleGeom } from "ol/geom";
import Feature from "ol/Feature";
import { Style, Fill, Stroke } from "ol/style";
import { getDistance } from "ol/sphere";
import { manejoError, manejoErrorMarcarParada } from "@/utils/mostrarErrores";
import { exitoToast } from "@/lib/notificaciones";
import { obtenerDatosUsuario } from "@/utils/datosUsuarioLocalStor";
import { usarPostMarcarParada } from "@/apis/administracion/apisMarcarParada";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MarcarParadaProps {
  latitudRes: string;
  longitudRes: string;
  idParada: number;
}

export default function MarcarParada({
  latitudRes,
  longitudRes,
  idParada,
}: MarcarParadaProps) {
  const [coordenadasUsuario, setCoordenadasUsuario] = useState<{
    lat: number | null;
    lon: number | null;
  }>({ lat: null, lon: null });
  const [mapa, setMapa] = useState<Map | null>(null);
  const [fuenteVectorial] = useState(new VectorSource());
  const [fuenteVectorialUsuario] = useState(new VectorSource());
  const [mostrarBotonVerificacion, setMostrarBotonVerificacion] =
    useState(false);
  const [tipoLlegada, setTipoLlegada] = useState<string>("");
  const {
    mutate: postMarcarParada,
    data,
    error,
    isSuccess,
  } = usarPostMarcarParada();

  // Inicializa el mapa y las capas
  useEffect(() => {
    if (!latitudRes || !longitudRes) {
      manejoErrorMarcarParada("Latitud y longitud no están definidas");
      return;
    }

    // Configuración inicial del mapa.
    const mapaInicial = new Map({
      target: "mapContainer", // Contenedor del mapa en el DOM.
      layers: [new TileLayer({ source: new OSM() })], // Capa base de OpenStreetMap.
      view: new View({
        center: fromLonLat([Number(longitudRes), Number(latitudRes)]), // Centro del mapa.
        zoom: 13, // Nivel de zoom inicial.
      }),
    });

    // Agrega capa vectorial para el perímetro de la parada.
    const capaVectorial = new VectorLayer({ source: fuenteVectorial });
    mapaInicial.addLayer(capaVectorial);

    // Agrega capa vectorial para la ubicación del usuario.
    const capaVectorialUsuario = new VectorLayer({
      source: fuenteVectorialUsuario,
    });
    mapaInicial.addLayer(capaVectorialUsuario);

    setMapa(mapaInicial); // Almacena la referencia del mapa en el estado.

    // Limpia el mapa al desmontar el componente.
    return () => {
      mapaInicial.setTarget(undefined);
    };
  }, [latitudRes, longitudRes, fuenteVectorial, fuenteVectorialUsuario]);

  // Dibuja el perímetro de la parada en el mapa.
  useEffect(() => {
    if (!mapa || !Number(latitudRes) || !Number(longitudRes)) return;

    // Convierte las coordenadas de la parada a la proyección del mapa.
    const puntoSeleccionado = fromLonLat([
      Number(longitudRes),
      Number(latitudRes),
    ]);

    // Crea un círculo con un radio de 100 metros.
    const circuloCaracteristica = new Feature({
      geometry: new CircleGeom(puntoSeleccionado, 100), // Perímetro de 100 metros
    });

    // Aplica estilo al círculo
    circuloCaracteristica.setStyle(
      new Style({
        stroke: new Stroke({
          color: "rgba(255, 0, 0, 1)", // Color rojo
          width: 2,
        }),
        fill: new Fill({
          color: "rgba(255, 0, 0, 0.2)", // Relleno semitransparente
        }),
      })
    );

    fuenteVectorial.clear(); // Limpia geometrías anteriores.
    fuenteVectorial.addFeature(circuloCaracteristica); // Agrega el círculo al mapa.

    const geometry = circuloCaracteristica.getGeometry();

    // Ajusta la vista del mapa para mostrar el círculo.
    if (geometry) {
      mapa.getView().fit(geometry.getExtent(), {
        duration: 1000, // Animación de ajuste.
        maxZoom: 16, // Nivel de zoom máximo.
      });
    } else {
      manejoErrorMarcarParada("La geometría del círculo no está definida.");
    }

    // Obtiene la ubicación del usuario después de dibujar el perímetro.
    obtenerUbicacionUsuario();
  }, [latitudRes, longitudRes, mapa, fuenteVectorial]);

  // Obtiene la ubicación del usuario utilizando la API de geolocalización.
  const obtenerUbicacionUsuario = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordenadasUsuario({ lat: latitude, lon: longitude });

          if (mapa && latitude && longitude) {
            // Dibuja un círculo azul en la ubicación del usuario.
            const puntoUsuario = fromLonLat([longitude, latitude]);
            const circuloCaracteristicaUsuario = new Feature({
              geometry: new CircleGeom(puntoUsuario, 50), // Círculo de 50 metros alrededor del usuario
            });

            circuloCaracteristicaUsuario.setStyle(
              new Style({
                stroke: new Stroke({
                  color: "rgba(0, 0, 255, 1)", // Borde azul
                  width: 2,
                }),
                fill: new Fill({
                  color: "rgba(0, 0, 255, 0.2)", // Relleno semitransparente azul
                }),
              })
            );

            fuenteVectorialUsuario.clear();
            fuenteVectorialUsuario.addFeature(circuloCaracteristicaUsuario);

            // Ajusta la vista del mapa para mostrar el círculo del usuario.
            if (mapa && circuloCaracteristicaUsuario.getGeometry()) {
              const geometryUsuario =
                circuloCaracteristicaUsuario.getGeometry();
              if (geometryUsuario) {
                mapa.getView().fit(geometryUsuario.getExtent(), {
                  duration: 1000,
                  maxZoom: 16,
                });
              }
            } else {
              manejoErrorMarcarParada(
                "El mapa o la geometría del círculo de usuario no están definidos."
              );
            }

            setMostrarBotonVerificacion(true); // Mostrar el botón después de obtener la ubicación
          }
        },
        (error) => {
          console.error("Error al obtener la ubicación:", error);
          if (error.code === error.PERMISSION_DENIED) {
            manejoErrorMarcarParada(
              "Permiso de ubicación denegado. Habilítalo en la configuración de tu navegador."
            );
          }
        },
        {
          enableHighAccuracy: true, // Alta precisión.
          timeout: 10000, // Tiempo máximo de espera.
          maximumAge: 0, // No utiliza datos en caché.
        }
      );
    } else {
      manejoErrorMarcarParada(
        "La geolocalización no es soportada por este navegador."
      );
    }
  };

  // Verifica si el usuario está dentro del perímetro definido alrededor de la parada
  const verificarDentroDelPerimetro = () => {
    // Verifica que las coordenadas de la parada y del usuario sean válidas
    if (
      Number(latitudRes) && // Se asegura de que la latitud de la parada sea un número válido
      Number(longitudRes) && // Se asegura de que la longitud de la parada sea un número válido
      coordenadasUsuario.lat && // Verifica que la latitud del usuario esté definida
      coordenadasUsuario.lon // Verifica que la longitud del usuario esté definida
    ) {
      // Convierte las coordenadas de la parada y del usuario a arrays para el cálculo de distancia
      const puntoSeleccionado = [Number(longitudRes), Number(latitudRes)]; // Coordenadas de la parada
      const puntoUsuario = [coordenadasUsuario.lon, coordenadasUsuario.lat]; // Coordenadas del usuario

      // Calcula la distancia en metros entre la parada y el usuario
      const distancia = getDistance(puntoSeleccionado, puntoUsuario);

      // Si la distancia es menor o igual a 100 metros, el usuario está dentro del perímetro
      if (distancia <= 100) {
        // Construye los datos necesarios para enviar al backend
        const datosParaPost = {
          tipo: tipoLlegada, // Tipo de llegada (por ejemplo, "Inicio" o "Final") seleccionado por el usuario
          id_usuario: Number(obtenerDatosUsuario()?.id), // Obtiene el ID del usuario desde el almacenamiento local
          id_parada: Number(idParada), // ID de la parada actual
        };

        // Llama a la función mutadora para realizar el POST y registrar la llegada
        postMarcarParada(datosParaPost);
      } else {
        // Si la distancia es mayor a 100 metros, el usuario está fuera del perímetro
        manejoErrorMarcarParada("Estás fuera del perímetro."); // Muestra un mensaje de error
      }
    } else {
      // Si las coordenadas no son válidas, solicita al usuario que obtenga su ubicación
      manejoErrorMarcarParada("Por favor obtén tu ubicación.");
    }
  };

  // Efecto para manejar el estado de éxito o error del POST.
  useEffect(() => {
    if (isSuccess) {
      exitoToast(
        `Se registró la llegada a la parada: ${data.parada} con el tipo de llegada: ${data.tipo}, en la zona: ${data.tipo_parada}`
      );
    }

    if (error) {
      manejoError(error);
    }
  }, [isSuccess, error, data]);
  return (
    <div>
      <div className="m-4">
        <div
          id="mapContainer"
          className="w-full h-96 shadow-2xl"
          style={{ borderRadius: "10px", overflow: "hidden" }}
        />
      </div>

      <div className="m-4 ">
        <p className="capitalize my-8 text-center text-lg font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-2xl dark:text-white">
          tu perimetro es de color azul, debes estar dentro del perimetro rojo
          para marcar tu llegada a la parada
        </p>
        {mostrarBotonVerificacion && (
          <div className="flex justify-center items-center">
            <button
              onClick={verificarDentroDelPerimetro}
              disabled={!tipoLlegada} // Botón desactivado si no hay selección
              className={`text-red-500 bg-white border-4 border-red-500 rounded-lg px-5 py-2 text-xl font-bold shadow-xl transition-transform duration-500 ease-in-out transform ${
                !tipoLlegada
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-110"
              }`}
              style={{
                animation: tipoLlegada ? "pulse 3s infinite" : undefined,
              }}
            >
              Marcar llegada a Parada
            </button>
          </div>
        )}
      </div>

      <div className=" w-64 mx-auto">
        <Select onValueChange={(value) => setTipoLlegada(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tu llegada" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tipo de Llegada</SelectLabel>
              <SelectItem className="text-2xl" value="Inicio">
                Inicio
              </SelectItem>
              <SelectItem className="text-2xl" value="Final">
                Final
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="m-4 ">
        <p className="capitalize my-8 text-center text-lg font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-2xl dark:text-white">
          si llego a la parada y saldra nuevamente a la ruta debe marcar final y
          luego inicio
        </p>
      </div>
    </div>
  );
}
/* const datosParaPost = {
          tipo: tipoLlegada,
          id_usuario: Number(obtenerDatosUsuario()?.id),
          id_parada: Number(idParada),
        };

        // Ejecuta el POST
        postMarcarParada(datosParaPost); */
