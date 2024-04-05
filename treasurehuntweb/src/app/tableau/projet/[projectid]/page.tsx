"use client";
import { useEffect, useState, useRef } from "react";
import { MapComponent } from "./mapComponent";
import { ProjectObjectivesComponent } from "./projectObjectivesComponent";
import { api } from "~/trpc/client";
import { useMarkers } from "~/lib/useMarkers";

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

  const {
    deleteObjective,
    addObjectiveAndMarkerOnClickListener,
    changeObjectiveOrder,
  } = useMarkers(
    objectives,
    mapObject,
    Number(params.projectid),
    markers,
    setMarkers,
    objectivesFetchedAfterMount,
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
              changeObjectiveOrder={changeObjectiveOrder}
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
