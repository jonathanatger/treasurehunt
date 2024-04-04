import { useRef, useEffect } from "react";
import { MutableRefObject } from "react";
import { simplifiedProjectObjective } from "~/app/tableau/projet/[projectid]/page";
import { SetStateAction } from "react";

export const useMarkers = function (
  objectives: simplifiedProjectObjective[],
  setObjectives: React.Dispatch<SetStateAction<simplifiedProjectObjective[]>>,
  mapObject: google.maps.Map | null,
) {
  const currentListener: MutableRefObject<google.maps.MapsEventListener | null> =
    useRef(null);

  function addMarkerOnClickListener(mapObject: google.maps.Map | null) {
    if (mapObject === null) return;

    currentListener.current = mapObject?.addListener("click", (e: any) => {
      const orderOfNewObjective = objectives.reduce<number>((acc, value) => {
        if (value.order >= acc) {
          return value.order + 1;
        } else {
          return acc;
        }
      }, 1);

      let newMarker = placeMarkerAndPanTo(
        e.latLng,
        mapObject,
        orderOfNewObjective,
      );

      updateObjectivesWithNewMarker(newMarker, e.latLng, orderOfNewObjective);

      if (currentListener.current)
        google.maps.event.removeListener(currentListener.current);
    });
  }

  function placeMarkerAndPanTo(
    latLng: google.maps.LatLng,
    map: google.maps.Map,
    order: number,
  ) {
    const _marker = new google.maps.marker.AdvancedMarkerElement({
      position: latLng,
      map: map,
      title: order.toString(),
    });

    map.panTo(latLng);

    return _marker;
  }

  function updateObjectivesWithNewMarker(
    _marker: google.maps.marker.AdvancedMarkerElement,
    latLng: google.maps.LatLng,
    _order: number,
  ) {
    if (objectives) {
      setObjectives([
        ...objectives,
        {
          latitude: latLng.lat(),
          longitude: latLng.lng(),
          order: _order,
          marker: _marker,
        },
      ]);
    }
  }

  function deleteObjective(_order: number) {
    const _marker = objectives.find((obj) => obj.order === _order)?.marker;
    if (_marker) {
      _marker.map = null;

      let remainingObjectives = objectives.filter((obj) => {
        return obj.order !== _order;
      });

      remainingObjectives.map((obj, index) => {
        obj.order = index + 1;
        obj.marker.title = (index + 1).toString();
      });

      setObjectives(remainingObjectives);
    }
  }

  function changeObjectiveOrder(currentOrder: number, newOrder: number) {
    let objectivesList = [...objectives];

    const firstObjectiveToChange = objectivesList.find(
      (obj) => obj.order === currentOrder,
    );
    const secondObjectiveToChange = objectivesList.find(
      (obj) => obj.order === newOrder,
    );

    if (
      firstObjectiveToChange === undefined ||
      secondObjectiveToChange === undefined
    )
      return;

    firstObjectiveToChange.order = newOrder;
    secondObjectiveToChange.order = currentOrder;

    setObjectives(objectivesList);
  }

  const polylineRef: MutableRefObject<google.maps.Polyline | undefined> =
    useRef();

  function updatePolyline() {
    const coordinates = objectives
      .sort((a, b) => {
        return a.order - b.order;
      })
      .reduce<Array<google.maps.LatLngLiteral>>((acc, value) => {
        const coords: google.maps.LatLngLiteral = {
          lat: value.latitude,
          lng: value.longitude,
        };
        return [...acc, coords];
      }, []);

    if (polylineRef.current) polylineRef.current.setMap(null);
    if (coordinates.length === 0) return;

    const polyline: google.maps.Polyline = new google.maps.Polyline({
      path: coordinates,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });

    polyline.setMap(mapObject);
    polylineRef.current = polyline;
  }

  return {
    addMarkerOnClickListener,
    deleteObjective,
    changeObjectiveOrder,
    updatePolyline,
  };
};
