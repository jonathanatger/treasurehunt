import { useEffect, useRef, useState } from "react";
import { ProjectObjective } from "~/server/db/schema";

export const useLocation = function (
  objectives: ProjectObjective[] | undefined,
  mapObject: google.maps.Map | null | undefined,
) {
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral>({
    lat: 46.227638,
    lng: 1.7191036,
  });
  const firstLoadBoundFit = useRef(true);

  useEffect(() => {
    if (
      objectives?.length === undefined ||
      !mapObject ||
      firstLoadBoundFit.current === false
    )
      return;
    const bounds = new google.maps.LatLngBounds();
    const objectivesLength = objectives.length;

    const newCenter = objectives.reduce(
      (acc, value, index) => {
        acc.lat = acc.lat + value.latitude / objectivesLength;
        acc.lng = acc.lng + value.longitude / objectivesLength;

        bounds.extend({ lat: value.latitude, lng: value.longitude });

        return acc;
      },
      { lat: 0, lng: 0 },
    );

    setUserLocation(newCenter);

    if (mapObject) {
      mapObject.panTo(newCenter);

      mapObject.fitBounds(bounds);
      firstLoadBoundFit.current = false;
    }
  }, [objectives, mapObject]);

  return userLocation;
};
