import { useEffect, useRef, useState } from "react";
import { MutableRefObject } from "react";
import { api } from "~/trpc/client";
import { getQueryKey } from "@trpc/react-query";
import { ProjectObjective } from "~/server/db/schema";

export const useMarkers = function (
  objectives: ProjectObjective[] | undefined,
  mapObject: google.maps.Map | null,
  _projectId: number,
  markers: google.maps.marker.AdvancedMarkerElement[],
  setMarkers: React.Dispatch<google.maps.marker.AdvancedMarkerElement[]>,
  objectivesFetchedAfterMount: boolean,
) {
  const DEFAULT_ON_CREATION_ID = -1;

  function createNewMarker(latitude: number, longitude: number, id: number) {
    return new google.maps.marker.AdvancedMarkerElement({
      position: { lat: latitude, lng: longitude },
      map: mapObject,
      title: id.toString(),
      gmpDraggable: true,
    });
  }

  // on the objectives change, synchronize the markers in
  // a declarative way
  useEffect(() => {
    console.log("objectives", objectives);
    console.log("markers", markers);
    let markersToSet: Array<google.maps.marker.AdvancedMarkerElement> = [];

    objectives?.forEach((obj) => {
      const correspondingMarker = markers.find(
        (marker) => marker.title === obj.id.toString(),
      );

      if (correspondingMarker === undefined) {
        const newMarker = createNewMarker(obj.latitude, obj.longitude, obj.id);
        markersToSet.push(newMarker);
        console.log("created new marker id :", newMarker.title);
        return;
      }

      if (
        correspondingMarker.position?.lat !== obj.latitude ||
        correspondingMarker.position?.lng !== obj.longitude
      ) {
        correspondingMarker.position = {
          lat: obj.latitude,
          lng: obj.longitude,
        };
        console.log("changed coordinates");
      }

      markersToSet.push(correspondingMarker);
    });

    markers.forEach((previousMarker) => {
      let check = true;
      objectives?.forEach((obj) => {
        if (obj.id.toString() === previousMarker.title) check = false;
        console.log("check got put to false");
      });
      if (check) {
        console.log("removed a marker id : ", previousMarker.title);
        previousMarker.map = null;
      }
    });

    console.log(
      "markersToSet : ",
      markersToSet.map((mark) => mark.title),
    );
    setMarkers(markersToSet);
  }, [objectives]);

  // On objectives and map load, set the first markers based on existing objectives
  // in the project
  useEffect(() => {
    if (mapObject === null || objectives === undefined) return;

    const _markers = objectives.map((obj) => {
      return createNewMarker(obj.latitude, obj.longitude, obj.id);
    });

    setMarkers(_markers);
  }, [mapObject, objectivesFetchedAfterMount]);

  // Add new objective, with a click on the map.
  // step 1 : create listener on the map, to get the click
  // step 2 : listener triggers callback, place a marker, pans the map to the point
  // step 3 : db call, with optimistic state update and correction should there be a problem
  const currentListener: MutableRefObject<google.maps.MapsEventListener | null> =
    useRef(null);

  function addObjectiveAndMarkerOnClickListener(
    mapObject: google.maps.Map | null,
  ) {
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

      mapObject.panTo(e.latLng);

      callCreateNewObjectiveApi(e.latLng, orderOfNewObjective);

      document
        .getElementById("button-add-objective")
        ?.classList.remove(...cssButtonClasses);

      if (currentListener.current)
        google.maps.event.removeListener(currentListener.current);
    });
  }

  const apiUtils = api.useUtils();

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
            id: DEFAULT_ON_CREATION_ID,
            projectid: DEFAULT_ON_CREATION_ID,
            latitude: newObjective.latitude,
            longitude: newObjective.longitude,
            order: newObjective.order,
          },
        ];
      }

      apiUtils.projects.fetchProjectObjectives.setData(_projectId, newData);

      return { previousObjectives };
    },
    onError: (err, newObjective, context) => {
      apiUtils.projects.fetchProjectObjectives.setData(
        _projectId,
        context?.previousObjectives,
      );
      console.error(err);
    },
    onSettled: (res, ret, input, sth) => {
      /*
      setMarkers(
        // @ts-ignore
        (previousMarkers: google.maps.marker.AdvancedMarkerElement[]) => {
          let _markers = [...previousMarkers];
          console.log("in setMarkers", _markers);

          _markers.forEach((marker) => {
            if (marker.title === DEFAULT_ON_CREATION_ID.toString()) {
              const newId = objectives
                ?.find((obj) => obj.order === input.order)
                ?.id.toString();

              marker.title = newId ? newId.toString() : (1).toString();
            }
          });

          return _markers;
        },
      );
      */

      apiUtils.projects.fetchProjectObjectives.invalidate();
    },
  });

  function callCreateNewObjectiveApi(
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

  // Delete an objective, its marker
  // and changes the order of the objectives accordingly

  const deleteMutationCall = api.objectives.delete.useMutation({
    onMutate: (variables) => {
      const previousObjectives =
        apiUtils.projects.fetchProjectObjectives.getData(_projectId);

      if (previousObjectives === undefined) return previousObjectives;

      const filteredObjectives = previousObjectives.filter(
        (obj) =>
          obj.projectid === variables.projectId &&
          obj.order !== variables.order,
      );

      apiUtils.projects.fetchProjectObjectives.setData(
        _projectId,
        filteredObjectives,
      );

      return { previousObjectives };
    },
    onError: (err, variables, context) => {
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

  function deleteObjective(_order: number) {
    deleteMutationCall.mutate({ projectId: _projectId, order: _order });
  }

  // Change the order of objectives
  const orderChangeMutationCall = api.objectives.changeOrder.useMutation({
    onSettled: (data) => {
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

  useEffect(() => {
    updatePolyline();
  }, [objectives]);

  return {
    addObjectiveAndMarkerOnClickListener,
    deleteObjective,
    changeObjectiveOrder,
    updatePolyline,
  };
};
