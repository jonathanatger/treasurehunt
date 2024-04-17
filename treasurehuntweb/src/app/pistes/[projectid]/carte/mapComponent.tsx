import { useContext, SetStateAction, useEffect } from "react";
import { Plus } from "lucide-react";
import { useGMapImports } from "~/lib/useImportGMapAPI";
import { useIpLocation } from "~/lib/useLocation";
import { Button } from "~/components/ui/button";
import { ObjectivesContext } from "./page";

export function MapComponent({
  setMap,
}: {
  setMap: React.Dispatch<SetStateAction<google.maps.Map | null>>;
}) {
  const userLocation: google.maps.LatLngLiteral = useIpLocation();
  const apiImportsAreLoading: boolean = useGMapImports();
  const mapObject = useContext(ObjectivesContext)?.mapObject;
  const addObjectiveAndMarkerOnClickListener =
    useContext(ObjectivesContext)?.addObjectiveAndMarkerOnClickListener;

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
      document.getElementById("map-container") as HTMLElement,
      mapOptions,
    );

    setMap(_map);
  }, [apiImportsAreLoading]);

  return (
    <div className="relative h-[calc(100%+24px)] w-full">
      {apiImportsAreLoading ? (
        <LoadingComponent />
      ) : (
        <div className="h-full w-full" id="map-container"></div>
      )}
      <div className="absolute bottom-0 z-50 flex w-full justify-center ">
        <Button
          className="m-8 h-24 w-64 bg-secondary text-lg font-bold shadow-lg"
          id="button-add-objective"
          onClick={() => {
            if (
              addObjectiveAndMarkerOnClickListener === undefined ||
              mapObject === undefined
            )
              return;
            addObjectiveAndMarkerOnClickListener(mapObject);
          }}
        >
          <Plus className="mr-4 h-12 w-12" />{" "}
          <h3 className="text-wrap">Ajouter un objectif sur la carte</h3>
        </Button>
      </div>
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
