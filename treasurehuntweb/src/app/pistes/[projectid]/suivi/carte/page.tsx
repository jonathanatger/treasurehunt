"use client";
import { useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useGMapImports } from "~/lib/useImportGMapAPI";
import { useLocation } from "~/lib/useLocation";
import { useSyncClientAndServerState } from "~/lib/useSyncClientServer";
import { api } from "~/trpc/client";
import { ObjectivesContext } from "../../objectifs/objectivesContext";

export default function Page({ params }: { params: { projectid: string } }) {
  const apiImportsAreLoading: boolean = useGMapImports();
  const [mapObject, setMapObject] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<
    {
      clientId: number;
      marker: google.maps.marker.AdvancedMarkerElement;
      listener: google.maps.MapsEventListener | null;
    }[]
  >([]);
  const { data: objectives, error } =
    api.projects.fetchProjectObjectives.useQuery(Number(params.projectid));

  const userLocation: google.maps.LatLngLiteral = useLocation(
    objectives,
    mapObject,
  );
  const areMarkersDraggable = false;

  const {} = useSyncClientAndServerState(
    objectives,
    mapObject,
    Number(params.projectid),
    markers,
    setMarkers,
    markerSimplifiedContent,
    areMarkersDraggable,
  );

  useEffect(() => {
    if (apiImportsAreLoading === true) return;

    const mapOptions = {
      center: { lat: userLocation.lat, lng: userLocation.lng },
      zoom: 6,
      mapId: "ff0e486cd3e262db",
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
    };

    const _map = new google.maps.Map(
      document.getElementById("map-container")!,
      mapOptions,
    );

    setMapObject(_map);
  }, [apiImportsAreLoading]);

  return (
    <section className="flex h-full w-full flex-row space-x-4">
      <div className="h-full w-96">
        <Table className="grow overflow-auto">
          <TableCaption>
            L'avancement des participants sera mis à jour ici lors de la partie.
          </TableCaption>
          <TableHeader className="outline outline-1 outline-muted">
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead className="w-[200px] text-right">
                Dernier objectif atteint
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="">
            <TableRow></TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="h-full grow overflow-clip rounded-3xl">
        {apiImportsAreLoading ? (
          <LoadingComponent />
        ) : (
          <div className="h-[calc(100%+24px)] w-full" id="map-container"></div>
        )}
      </div>
    </section>
  );
}

function LoadingComponent() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-400">
      <h2>Chargement...</h2>
    </div>
  );
}

function markerSimplifiedContent(title: string, isHighlighted: boolean) {
  const newHtmlElement = document.createElement("div");
  const bgColor = isHighlighted ? "bg-secondary" : "bg-primary";
  const borderColor = isHighlighted ? "border-secondary" : "border-t-primary";

  newHtmlElement.innerHTML = `
  <div class="flex flex-col justify-center items-center text-primary-foreground">
    <div class="p-2 min-h-8 min-w-16 max-w-64 ${bgColor} font-bold flex flex-col items-start space-y-2 justify-center rounded-md shadow-md">
    <h3 class="text-md truncate">${title}</h3>
    </div>
    <div class="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 ${borderColor} shadow-md">
    </div>
  </div>`;
  return newHtmlElement;
}
