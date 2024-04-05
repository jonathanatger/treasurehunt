import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useGMapImports } from "~/lib/useImportGMapAPI";
import { useIpLocation } from "~/lib/useLocation";

export function MapComponent({
  setMap,
}: {
  setMap: React.Dispatch<SetStateAction<google.maps.Map | null>>;
}) {
  const userLocation: google.maps.LatLngLiteral = useIpLocation();
  const apiImportsAreLoading: boolean = useGMapImports();

  useEffect(() => {
    if (apiImportsAreLoading === true) return;

    const mapOptions = {
      center: { lat: userLocation.lat, lng: userLocation.lng },
      zoom: 6,
      mapId: "ff0e486cd3e262db",
      zoomControl: true,
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
    <>
      {apiImportsAreLoading ? (
        <LoadingComponent />
      ) : (
        <div className="h-full w-full" id="map-container" />
      )}
    </>
  );
}

function LoadingComponent() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-400">
      <h2>Chargement...</h2>
    </div>
  );
}
