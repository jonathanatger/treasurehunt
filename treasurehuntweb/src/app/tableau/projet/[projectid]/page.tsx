"use client";
import { useEffect, useState, useRef } from "react";
import { MapComponent } from "./mapComponent";
import { ProjectObjectivesComponent } from "./projectObjectivesComponent";
import { api } from "~/trpc/client";
import { useMarkers } from "~/lib/useMarkers";
import { useSyncClientAndServerState } from "~/lib/useSyncClientServer";

export default function Page({ params }: { params: { projectid: string } }) {
  const [mapObject, setMapObject] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<
    google.maps.marker.AdvancedMarkerElement[]
  >([]);

  // fetch data to initialize the component
  const {
    data: objectives,
    error,
    isLoading,
    isFetchedAfterMount: objectivesFetchedAfterMount,
  } = api.projects.fetchProjectObjectives.useQuery(Number(params.projectid));

  const { updatePolyline, debouncedObjectivesDataCacheInvalidation } =
    useSyncClientAndServerState(
      objectives,
      mapObject,
      Number(params.projectid),
      markers,
      setMarkers,
    );

  const {
    deleteObjective,
    addObjectiveAndMarkerOnClickListener,
    switchObjectiveOrder,
  } = useMarkers(
    objectives,
    mapObject,
    Number(params.projectid),
    updatePolyline,
    debouncedObjectivesDataCacheInvalidation,
  );

  return (
    <>
      <main className="h-full w-full p-4">
        <section className="flex h-full w-full flex-row overflow-clip rounded-3xl bg-slate-600 outline outline-1 outline-slate-500">
          <div className="h-full w-64 overflow-auto">
            <ProjectObjectivesComponent
              objectives={objectives}
              mapObject={mapObject}
              deleteObjective={deleteObjective}
              switchObjectiveOrder={switchObjectiveOrder}
              addObjectiveAndMarkerOnClickListener={
                addObjectiveAndMarkerOnClickListener
              }
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
