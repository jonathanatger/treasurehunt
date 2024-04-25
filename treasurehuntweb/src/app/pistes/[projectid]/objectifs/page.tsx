"use client";
import { Dispatch, SetStateAction, createContext, useState } from "react";
import { MapComponent } from "./mapComponent";
import { ProjectObjectivesComponent } from "./projectObjectivesComponent";
import { api } from "~/trpc/client";
import { useMarkersAndObjectives } from "~/lib/useMarkersAndObjectives";
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

  const areMarkersDraggable = true;

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
    areMarkersDraggable,
  );

  const {
    deleteObjective,
    addObjectiveAndMarkerOnClickListener,
    switchObjectiveOrder,
    changeClueMessage,
    changeTitleOfObjective,
  } = useMarkersAndObjectives(
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
            changeTitleOfObjective: changeTitleOfObjective,
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
          <div className="flex grow items-center justify-start overflow-clip rounded-3xl ">
            <MapComponent setMap={setMapObject} />
          </div>
        </ObjectivesContext.Provider>
      </main>
    </>
  );
}

function markerContent(title: string, isHighlighted: boolean) {
  const newHtmlElement = document.createElement("div");
  const bgColor = isHighlighted ? "bg-secondary" : "bg-primary";
  const borderColor = isHighlighted ? "border-secondary" : "border-t-primary";

  newHtmlElement.innerHTML = `
  <div class="flex flex-col justify-center items-center text-primary-foreground">
    <div class="p-2 min-h-12 min-w-16 ${bgColor} font-bold flex flex-col items-start space-y-2 justify-center rounded-md shadow-md">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="22"/></svg>
    <h3 class="text-lg max-w-32 line-clamp-2 ">${title}</h3>
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
    setButtonMessage: Dispatch<SetStateAction<string>>,
  ) => void;
  switchObjectiveOrder: (currentId: number, displacement: number) => void;
  changeClueMessage: (clientId: number, text: string) => void;
  markerContent: (title: string, isHighlighted: boolean) => HTMLDivElement;
  cluesVisible: boolean;
  changeTitleOfObjective: (clientId: number, title: string) => void;
} | null;
