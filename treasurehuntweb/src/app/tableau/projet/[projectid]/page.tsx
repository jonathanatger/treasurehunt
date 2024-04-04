"use client";
import { useEffect, useState } from "react";
import { MapComponent } from "./mapComponent";
import { ProjectObjectivesComponent } from "./projectObjectivesComponent";
import { api } from "~/trpc/client";
import { Button } from "~/components/ui/button";
import { ProjectObjective } from "~/server/db/schema";
import { isObject } from "@trpc/server/unstable-core-do-not-import";

export type simplifiedProjectObjective = {
  latitude: number;
  longitude: number;
  order: number;
  marker: google.maps.marker.AdvancedMarkerElement;
};

export default function Page({ params }: { params: { projectid: string } }) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [objectives, setObjectives] = useState<simplifiedProjectObjective[]>(
    [],
  );

  // fetch data to initialize the component
  const { data, error, isLoading } =
    api.projects.fetchProjectObjectives.useQuery(Number(params.projectid));

  // Load the data into the React State and initialize Markers based on existing data
  useEffect(() => {
    if (data === undefined || isLoading) return;

    let simplifiedObjectivesData = data.reduce<simplifiedProjectObjective[]>(
      (acc, value) => {
        let _marker = new google.maps.marker.AdvancedMarkerElement({
          position: { lat: value.latitude, lng: value.longitude },
          map: map,
          title: value.order.toString(),
        });

        return [
          ...acc,
          {
            latitude: value.latitude,
            longitude: value.longitude,
            order: value.order,
            marker: _marker,
          },
        ];
      },
      [],
    );

    setObjectives(simplifiedObjectivesData);
  }, [data, isLoading]);

  return (
    <>
      <main className="h-full w-full p-4">
        <section className="flex h-full w-full flex-row overflow-clip rounded-3xl bg-slate-600 outline outline-1 outline-slate-500">
          <div className="h-full w-64 ">
            <ProjectObjectivesComponent
              objectives={objectives}
              setObjectives={setObjectives}
              mapObject={map}
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
