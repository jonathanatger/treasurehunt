import { useContext, SetStateAction, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useGMapImports } from "~/lib/useImportGMapAPI";
import { useLocation } from "~/lib/useLocation";
import { Button } from "~/components/ui/button";
import { ObjectivesContext } from "./objectivesContext";
import ErrorBoundary from "~/components/errorComponent";

export function MapComponent({
  setMap,
}: {
  setMap: React.Dispatch<SetStateAction<google.maps.Map | null>>;
}) {
  const objectives = useContext(ObjectivesContext)?.objectives;
  const apiImportsAreLoading: boolean = useGMapImports();
  const mapObject = useContext(ObjectivesContext)?.mapObject;
  const userLocation: google.maps.LatLngLiteral = useLocation(
    objectives,
    mapObject,
  );
  const addObjectiveAndMarkerOnClickListener =
    useContext(ObjectivesContext)?.addObjectiveAndMarkerOnClickListener;
  const [buttonMessage, setButtonMessage] = useState(
    "Ajouter un objectif sur la carte",
  );

  const screenIsLarge = window.screen.width > 782 ? true : false;

  useEffect(() => {
    if (apiImportsAreLoading === true) return;

    const mapOptions = {
      center: { lat: userLocation.lat, lng: userLocation.lng },
      zoom: 6,
      mapId: "ff0e486cd3e262db",
      zoomControl: screenIsLarge,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.RIGHT_CENTER,
      },
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

    setMap(_map);
  }, [apiImportsAreLoading]);

  return (
    <div className="relative top-2  flex h-[calc(100%+36px)] w-[calc(100%+2px)] ">
      <ErrorBoundary>
        {apiImportsAreLoading ? (
          <LoadingComponent />
        ) : (
          <div className="h-full w-full" id="map-container"></div>
        )}
        <div className="pointer-events-none absolute top-2 z-40 flex w-full justify-center">
          <Button
            className="pointer-events-auto m-4 h-12 w-52  bg-secondary font-bold shadow-lg hover:bg-primary/100 active:outline active:outline-1 active:outline-white md:h-24 md:w-64 md:text-lg"
            id="button-add-objective"
            onClick={() => {
              if (
                addObjectiveAndMarkerOnClickListener === undefined ||
                mapObject === undefined
              )
                return;

              addObjectiveAndMarkerOnClickListener(mapObject, setButtonMessage);
            }}
          >
            <Plus className="mr-4 h-12 w-12" />
            <h3 className="text-wrap">{buttonMessage}</h3>
          </Button>
        </div>
      </ErrorBoundary>
    </div>
  );
}

function LoadingComponent() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-400">
      <h2>Chargement...</h2>
    </div>
  );
}
