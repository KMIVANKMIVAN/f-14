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
import { usarPostAsistencia } from "@/apis/funcionalidades/apisAsistencias";

export default function MarcarAsistencia() {
  const [coordenadasUsuario, setCoordenadasUsuario] = useState<{
    lat: number | null;
    lon: number | null;
  }>({ lat: null, lon: null });
  const [mapa, setMapa] = useState<Map | "">("");
  const [mostrarBotonVerificacion, setMostrarBotonVerificacion] =
    useState(false);

  const {
    mutate: postAsistencia,
    isSuccess: isSuccessAsistencia,
    error: errorAsistencia,
    data: dataAsistencia,
  } = usarPostAsistencia();

  useEffect(() => {
    const vectorSource = new VectorSource();
    const initialMap = new Map({
      target: "mapContainer",
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({ source: vectorSource }),
      ],
      view: new View({
        center: fromLonLat([-68.045117, -16.535812]),
        zoom: 13,
      }),
    });

    setMapa(initialMap);
    return () => {
      initialMap.setTarget(undefined);
    };
  }, []);

  useEffect(() => {
    if (!mapa) return;
    dibujarPerimetro();
    obtenerUbicacionUsuario();
  }, [mapa]);

  const dibujarPerimetro = () => {
    if (!mapa) return;

    const puntoSeleccionado = fromLonLat([-68.045117, -16.535812]);
    const circuloCaracteristica = new Feature({
      geometry: new CircleGeom(puntoSeleccionado, 20), // Perímetro de 20 metros
    });

    circuloCaracteristica.setStyle(
      new Style({
        stroke: new Stroke({ color: "rgba(255, 0, 0, 1)", width: 2 }),
        fill: new Fill({ color: "rgba(255, 0, 0, 0.2)" }),
      })
    );

    const vectorLayer = mapa
      .getLayers()
      .item(1) as VectorLayer<VectorSource> | null;
    const source = vectorLayer?.getSource();

    if (source) {
      source.clear();
      source.addFeature(circuloCaracteristica);

      // Verificación adicional para asegurarse de que getGeometry() no sea undefined
      const geometry = circuloCaracteristica.getGeometry();
      if (geometry) {
        mapa
          .getView()
          .fit(geometry.getExtent(), { duration: 1000, maxZoom: 16 });
      } else {
        manejoErrorMarcarParada("La geometría del círculo es nula.");
      }
    } else {
      manejoErrorMarcarParada("La fuente de la capa vectorial es nula.");
    }
  };

  const obtenerUbicacionUsuario = () => {
    if (!navigator.geolocation) {
      return manejoErrorMarcarParada(
        "La geolocalización no es soportada por este navegador."
      );
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordenadasUsuario({ lat: latitude, lon: longitude });
        dibujarCirculoUsuario(latitude, longitude);
        setMostrarBotonVerificacion(true);
      },
      (error) => manejarGeolocalizacionError(error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const dibujarCirculoUsuario = (latitude: number, longitude: number) => {
    if (!mapa) {
      manejoErrorMarcarParada("El mapa no está disponible.");
      return;
    }

    const puntoUsuario = fromLonLat([longitude, latitude]);
    const circuloCaracteristicaUsuario = new Feature({
      geometry: new CircleGeom(puntoUsuario, 5), // Círculo de 5 metros alrededor del usuario
    });

    circuloCaracteristicaUsuario.setStyle(
      new Style({
        stroke: new Stroke({ color: "rgba(0, 0, 255, 1)", width: 2 }),
        fill: new Fill({ color: "rgba(0, 0, 255, 0.2)" }),
      })
    );

    const vectorLayer = mapa
      .getLayers()
      .item(1) as VectorLayer<VectorSource> | null;
    const source = vectorLayer?.getSource();

    if (source) {
      source.addFeature(circuloCaracteristicaUsuario);

      const geometry = circuloCaracteristicaUsuario.getGeometry();
      if (geometry) {
        mapa
          .getView()
          .fit(geometry.getExtent(), { duration: 1000, maxZoom: 16 });
      } else {
        manejoErrorMarcarParada("La geometría del círculo de usuario es nula.");
      }
    } else {
      manejoErrorMarcarParada("La fuente de la capa vectorial es nula.");
    }
  };

  const manejarGeolocalizacionError = (error: GeolocationPositionError) => {
    if (error.code === error.PERMISSION_DENIED) {
      manejoErrorMarcarParada(
        "Permiso de ubicación denegado. Habilítalo en la configuración de tu navegador."
      );
    }
  };

  const verificarDentroDelPerimetro = () => {
    if (coordenadasUsuario.lat !== null && coordenadasUsuario.lon !== null) {
      const puntoSeleccionado = [-68.045117, -16.535812];
      const puntoUsuario = [coordenadasUsuario.lon, coordenadasUsuario.lat];
      const distancia = getDistance(puntoSeleccionado, puntoUsuario);

      if (distancia <= 20) {
        exitoToast("Estás dentro del perímetro.");
        postAsistencia({ id_usuario: Number(obtenerDatosUsuario()?.id) });
      } else {
        manejoErrorMarcarParada("Estás fuera del perímetro.");
        // postAsistencia({ id_usuario: Number(obtenerDatosUsuario()?.id) });
      }
    } else {
      manejoErrorMarcarParada("Por favor obtén tu ubicación.");
    }
  };

  if (isSuccessAsistencia) {
    exitoToast(`Se Registro la Asistencia: ${dataAsistencia.id}`);
  }

  if (errorAsistencia) {
    manejoError(errorAsistencia);
  }
  return (
    <div>
      <div className="m-4">
        <div
          id="mapContainer"
          className="w-full h-96 shadow-2xl"
          style={{ borderRadius: "10px", overflow: "hidden" }}
        />
      </div>
      <div className="m-4">
        <p className="capitalize my-8 text-center text-lg font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-2xl dark:text-white">
          Tu perímetro es de color azul, debes estar dentro del perímetro rojo
          para marcar tu asistencia.
        </p>
        {mostrarBotonVerificacion && (
          <div className="flex justify-center items-center">
            <button
              onClick={verificarDentroDelPerimetro}
              className="text-green-500 bg-white border-4 border-red-500 rounded-lg px-5 py-4 text-3xl font-bold shadow-lg transition-transform duration-500 ease-in-out transform hover:scale-110"
              style={{ animation: "pulse 3s infinite" }}
            >
              Tomar Asistencia
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
