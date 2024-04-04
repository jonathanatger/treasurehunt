"use client";
import { useEffect, useState, useRef } from "react";
import { MapComponent } from "./mapComponent";
import { ProjectObjectivesComponent } from "./projectObjectivesComponent";
import { api } from "~/trpc/client";

export type simplifiedProjectObjective = {
  latitude: number;
  longitude: number;
  order: number;
  marker: google.maps.marker.AdvancedMarkerElement;
};

export default function Page({ params }: { params: { projectid: string } }) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // fetch data to initialize the component
  const {
    data: objectives,
    error,
    isLoading,
  } = api.projects.fetchProjectObjectives.useQuery(Number(params.projectid));

  return (
    <>
      <main className="h-full w-full p-4">
        <section className="flex h-full w-full flex-row overflow-clip rounded-3xl bg-slate-600 outline outline-1 outline-slate-500">
          <div className="h-full w-64 overflow-auto">
            <ProjectObjectivesComponent
              objectives={objectives}
              mapObject={map}
              projectId={Number(params.projectid)}
            />
          </div>
          <div className="grow bg-white">
            <MapComponent mapObject={map} setMap={setMap} />
          </div>
        </section>
      </main>
    </>
  );
}
