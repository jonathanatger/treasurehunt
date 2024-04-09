"use client";
import { useState } from "react";
import { MapComponent } from "./mapComponent";
import { ProjectObjectivesComponent } from "./projectObjectivesComponent";
import { api } from "~/trpc/client";
import { useMarkers } from "~/lib/useMarkers";
import { useSyncClientAndServerState } from "~/lib/useSyncClientServer";

export default function Page({ params }: { params: { projectid: string } }) {
  const [mapObject, setMapObject] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<
    {
      clientId: number;
      marker: google.maps.marker.AdvancedMarkerElement;
      listener: google.maps.MapsEventListener | null;
    }[]
  >([]);

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
      <main className="h-full w-full p-4">
        <section className="flex h-full w-full flex-row overflow-clip rounded-3xl bg-slate-600 outline outline-1 outline-slate-500">
          <div className="h-full w-64 overflow-auto">
            <ProjectObjectivesComponent
              objectives={objectives}
              markers={markers}
              mapObject={mapObject}
              deleteObjective={deleteObjective}
              switchObjectiveOrder={switchObjectiveOrder}
              addObjectiveAndMarkerOnClickListener={
                addObjectiveAndMarkerOnClickListener
              }
              markerContent={markerContent}
            />
          </div>
          <div className="grow bg-white">
            <MapComponent setMap={setMapObject} />
          </div>
        </section>
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
