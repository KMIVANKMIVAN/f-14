import { Loader } from "lucide-react";

export default function Cargando() {
  return (
    <div>
      <div
        role="status"
        className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2"
      >
        <Loader className="w-8 h-8 text-micolor500 animate-spin dark:text-gray-600 fill-blue-600" />

        <span className="sr-only">Cargando...</span>
      </div>
    </div>
  );
}
