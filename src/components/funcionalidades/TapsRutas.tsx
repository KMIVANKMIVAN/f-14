"use client";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import MarcarParada from "./MarcarParada";
import { usarGetParadaFindOneInicioFinal } from "@/apis/administracion/apisParadas";

const tabs = [
  { id: "ovejuyo", label: "ovejuyo" },
  { id: "arenales-uni", label: "arenales - uni" },
  { id: "nuevo-amanecer", label: "nuevo amanecer" },
  { id: "apania", label: "apaña" },
  { id: "calacalani", label: "calacalani" },
  { id: "wilacota", label: "wilacota" },
  { id: "codavisa", label: "codavisa" },
  { id: "santa-fe", label: "santa fe" },
  { id: "cotacota", label: "cotacota" },
  { id: "coqueni", label: "coqueni" },
  // { id: "micasa", label: "micasa" },
];

const desplegables = {
  ovejuyo: ["243", "385", "864", "969", "257", "291"],
  apania: ["818 Rojo", "239"],
  "arenales-uni": ["965", "818"],
  "nuevo-amanecer": ["201", "838 Rojo"],
  wilacota: ["800", "800 Verde"],
  calacalani: ["282", "994"],
  codavisa: ["343", "825", "978"],
  "santa-fe": ["844", "905"],
  cotacota: ["864 Verde"],
  coqueni: ["838"],
  // micasa: ["mi Casa"],
};
type TabKey = keyof typeof desplegables;
interface TapsRutasProps {
  iniciofin: string;
}

export default function TapsRutas({ iniciofin }: TapsRutasProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("ovejuyo");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const {
    data: datafindAllParadas,
    isLoading: isLoadingfindAllParadas,
    error: errorFindAllParadas,
  } = usarGetParadaFindOneInicioFinal(iniciofin, selectedOption);

  /* const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setDropdownOpen(true);
  }; */
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId as TabKey); // Convertir a TabKey
    setDropdownOpen(true);
  };

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    setTimeout(() => {
      setDropdownOpen(false);
    }, 250);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const dropdown = document.getElementById("dropdownHelper");
    const tabsContainer = document.getElementById("tabsContainer");

    if (
      dropdown &&
      !dropdown.contains(event.target as Node) &&
      tabsContainer &&
      !tabsContainer.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // console.log("datafindAllParadas", datafindAllParadas);

  return (
    <div>
      <div
        id="tabsContainer"
        className="border-b border-gray-200 dark:border-gray-700 mb-4"
      >
        {/* Cambiar de flex a grid */}
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-left text-md font-medium text-gray-500 dark:text-gray-400 mb-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <li key={tab.id} className="relative mb-2">
                <button
                  onClick={() => handleTabClick(tab.id)}
                  className={`capitalize inline-flex items-center justify-start  border-b-2 rounded-t-lg w-full ${
                    isActive
                      ? "border-micolor600 text-micolor600 dark:text-micolor500 dark:border-micolor500"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  }`}
                >
                  <MapPin
                    className={`w-4 h-4 me-2 ${
                      isActive
                        ? "text-micolor600 dark:text-micolor500"
                        : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                    }`}
                  />
                  {tab.label}
                </button>

                {isDropdownOpen && activeTab === tab.id && (
                  <div
                    id="dropdownHelper"
                    className="w-36 absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 mt-2"
                  >
                    <ul
                      className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdownHelperButton"
                    >
                      {desplegables[activeTab].map((option, index) => (
                        <li key={index}>
                          <div
                            className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                            onClick={() => handleOptionChange(option)}
                          >
                            <div className="flex items-center h-5">
                              <input
                                id={`helper-radio-${index}`}
                                type="radio"
                                name="options"
                                checked={selectedOption === option}
                                readOnly
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                              />
                            </div>
                            <label
                              htmlFor={`helper-radio-${index}`}
                              className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              {option}
                            </label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {selectedOption && (
        <div className="my-6">
          <p className="capitalize my-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-xl lg:text-2xl dark:text-white">
            La zona seleccionada es {activeTab} y la linea es {selectedOption}
          </p>
          {/* <span>{datafindAllParadas?.id}</span> */}
          {/* <MarcarParada
            latitudRes={datafindAllParadas?.latitud}
            longitudRes={datafindAllParadas?.longitud}
          /> */}
          <MarcarParada
            latitudRes={datafindAllParadas?.latitud ?? "0"}
            longitudRes={datafindAllParadas?.longitud ?? "0"}
            idParada={Number(datafindAllParadas?.id) ?? "0"}
          />
        </div>
      )}
    </div>
  );
}
