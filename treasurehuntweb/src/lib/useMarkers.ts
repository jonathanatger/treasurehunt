import { useRef, useEffect, useContext } from "react";
import { MutableRefObject } from "react";
import { api } from "~/trpc/client";
import { getQueryKey } from "@trpc/react-query";
import { ProjectObjective } from "~/server/db/schema";

export const useMarkers = function (
  objectives: ProjectObjective[] | undefined,
  mapObject: google.maps.Map | null,
  _projectId: number,
  queryClient: any,
) {
  // Add new objective, with a click on the map.
  // step 1 : create listener on the map, to get the click
  // step 2 : listener triggers callback, place a marker, pans the map to the point
  // step 3 : db call, with optimistic state update and correction should there be a problem
  const currentListener: MutableRefObject<google.maps.MapsEventListener | null> =
    useRef(null);

  function addMarkerOnClickListener(mapObject: google.maps.Map | null) {
    if (mapObject === null) return;
    const cssButtonClasses = ["animate-pulse", "outline", "outline-blue-200"];

    document
      .getElementById("button-add-objective")
      ?.classList.add(...cssButtonClasses);

    currentListener.current = mapObject?.addListener("click", (e: any) => {
      let orderOfNewObjective: number;
      if (objectives === undefined) orderOfNewObjective = 1;
      else {
        orderOfNewObjective = objectives.reduce<number>((acc, value) => {
          if (value.order >= acc) {
            return value.order + 1;
          } else {
            return acc;
          }
        }, 1);
      }

      let newMarker = placeMarkerAndPanTo(
        e.latLng,
        mapObject,
        orderOfNewObjective,
      );

      updateObjectivesWithNewMarker(newMarker, e.latLng, orderOfNewObjective);

      document
        .getElementById("button-add-objective")
        ?.classList.remove(...cssButtonClasses);

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

  const apiUtils = api.useUtils();

  const queryKey = getQueryKey(api.projects);
  const creationApiCall = api.objectives.create.useMutation({
    onMutate: (newObjective) => {
      const previousObjectives =
        apiUtils.projects.fetchProjectObjectives.getData(_projectId);

      let newData: ProjectObjective[];

      if (previousObjectives === undefined) newData = [];
      else {
        newData = [
          ...previousObjectives,
          {
            id: 9999999999999999,
            projectid: 99999999999999,
            latitude: newObjective.latitude,
            longitude: newObjective.longitude,
            order: newObjective.order,
          },
        ];
      }

      apiUtils.projects.fetchProjectObjectives.setData(_projectId, newData);

      return { previousObjectives };
    },
    onError: (err, newTodo, context) => {
      apiUtils.projects.fetchProjectObjectives.setData(
        _projectId,
        context?.previousObjectives,
      );
      console.error(err);
    },
    onSettled: () => {
      apiUtils.projects.fetchProjectObjectives.invalidate();
    },
  });

  function updateObjectivesWithNewMarker(
    _marker: google.maps.marker.AdvancedMarkerElement,
    latLng: google.maps.LatLng,
    _order: number,
  ) {
    creationApiCall.mutate({
      projectId: _projectId,
      order: _order,
      latitude: latLng.lat(),
      longitude: latLng.lng(),
    });
  }

  // Delete an objective
  const deleteMutationCall = api.objectives.delete.useMutation({
    onSettled: () => {
      apiUtils.projects.fetchProjectObjectives.invalidate();
    },
  });

  function deleteObjective(_order: number, _projectid: number) {
    deleteMutationCall.mutate({ projectId: _projectId, order: _order });
  }

  // Change the order of objectives
  const orderChangeMutationCall = api.objectives.changeOrder.useMutation({
    onSettled: () => {
      apiUtils.projects.fetchProjectObjectives.invalidate();
    },
  });

  function changeObjectiveOrder(currentOrder: number, newOrder: number) {
    if (objectives === undefined) return;
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

    orderChangeMutationCall.mutate({
      firstProject: { id: firstObjectiveToChange.id, order: newOrder },
      secondProject: { id: secondObjectiveToChange.id, order: currentOrder },
    });
  }

  // Create and update a polyline between objectives
  const polylineRef: MutableRefObject<google.maps.Polyline | undefined> =
    useRef();

  function updatePolyline() {
    if (objectives === undefined) return;
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
