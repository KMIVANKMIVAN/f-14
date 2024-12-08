import TarjetaCambiarContra from "@/components/TarjetaCambiarContra";

export default function page() {
  return (
    <div>
      <div
        className="relative flex items-center justify-center h-screen"
        style={{
          backgroundImage: 'url("/assets/portadacambiarpw.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay para oscurecer la imagen */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Componente que se renderiza encima */}
        <div className="relative z-10">
          <TarjetaCambiarContra />
        </div>
      </div>
    </div>
  );
}
