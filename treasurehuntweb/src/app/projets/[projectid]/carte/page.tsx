"use client";
import { createContext, useState } from "react";
import { MapComponent } from "./mapComponent";
import { ProjectObjectivesComponent } from "./projectObjectivesComponent";
import { api } from "~/trpc/client";
import { useMarkers } from "~/lib/useMarkers";
import { useSyncClientAndServerState } from "~/lib/useSyncClientServer";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProjectObjective } from "~/server/db/schema";

export const ObjectivesContext = createContext<objectiveContextType>(null);

export default function Page({ params }: { params: { projectid: string } }) {
  const [mapObject, setMapObject] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<
    {
      clientId: number;
      marker: google.maps.marker.AdvancedMarkerElement;
      listener: google.maps.MapsEventListener | null;
    }[]
  >([]);

  const [cluesVisible, setCluesVisible] = useState(false);
  // fetch data to initialize the component
  const { data: objectives, error } =
    api.projects.fetchProjectObjectives.useQuery(Number(params.projectid));

  const {
    updatePolyline,
    debouncedObjectivesDataCacheInvalidation,
    generateClientId,
  } = useSyncClientAndServerState(
    objectives,
    mapObject,
    Number(params.projectid),
    markers,
    setMarkers,
    markerContent,
  );

  const {
    deleteObjective,
    addObjectiveAndMarkerOnClickListener,
    switchObjectiveOrder,
    changeClueMessage,
  } = useMarkers(
    objectives,
    mapObject,
    Number(params.projectid),
    debouncedObjectivesDataCacheInvalidation,
    updatePolyline,
    generateClientId,
  );

  return (
    <>
      <main className="bg-red-4 00h flex h-full w-full flex-row ">
        <ObjectivesContext.Provider
          value={{
            mapObject: mapObject,
            objectives: objectives,
            markers: markers,
            updatePolyline: updatePolyline,
            deleteObjective: deleteObjective,
            addObjectiveAndMarkerOnClickListener:
              addObjectiveAndMarkerOnClickListener,
            switchObjectiveOrder: switchObjectiveOrder,
            changeClueMessage: changeClueMessage,
            markerContent: markerContent,
            cluesVisible: cluesVisible,
            
          }}
        >
          <div
            className={cn(
              cluesVisible ? "w-[550px]" : "w-[300px]",
              "scro mr-8 flex h-full flex-row rounded-3xl p-4 outline outline-4 outline-primary",
            )}
          >
            <div className="no-scrollbar h-full w-full overflow-auto">
              <ProjectObjectivesComponent />
            </div>
            <Button
              onClick={() => {
                setCluesVisible(!cluesVisible);
              }}
              className="ml-4 flex h-full w-8 flex-col items-center justify-start shadow-lg"
            >
              {cluesVisible ? (
                <ArrowLeft size={24} strokeWidth={3} className="mb-4" />
              ) : (
                <ArrowRight size={24} strokeWidth={3} className="mb-4" />
              )}
              <h3 className="-rotate-90 p-4 font-title text-xl tracking-widest">
                INDICES
              </h3>
            </Button>
          </div>
          <div className="grow overflow-clip rounded-3xl">
            <MapComponent setMap={setMapObject} />
          </div>
        </ObjectivesContext.Provider>
      </main>
    </>
  );
}

function markerContent(title: string, isHighlighted: boolean) {
  const newHtmlElement = document.createElement("div");
  const bgColor = isHighlighted ? "bg-slate-300" : "bg-white";
  const borderColor = isHighlighted ? "border-t-slate-300" : "border-t-white";

  newHtmlElement.innerHTML = `
  <div class="flex flex-col justify-center items-center">
    <div class="p-2 min-h-8 ${bgColor} text-black font-bold flex flex-col items-center justify-center rounded-md shadow-md">
    ${title}
    </div>
    <div class="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 ${borderColor} shadow-md">
    </div>
  </div>`;
  return newHtmlElement;
}

type objectiveContextType = {
  mapObject: google.maps.Map | null;
  objectives: ProjectObjective[] | undefined;
  markers: {
    clientId: number;
    marker: google.maps.marker.AdvancedMarkerElement;
    listener: google.maps.MapsEventListener | null;
  }[];
  updatePolyline: () => void;
  deleteObjective: (order: number) => void;
  addObjectiveAndMarkerOnClickListener: (
    mapObject: google.maps.Map | null,
  ) => void;
  switchObjectiveOrder: (currentId: number, displacement: number) => void;
  changeClueMessage: (clientId: number, text: string) => void;
  markerContent: (title: string, isHighlighted: boolean) => HTMLDivElement;
  cluesVisible: boolean;
} | null;
