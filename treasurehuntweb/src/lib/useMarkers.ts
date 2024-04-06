import { useEffect, useRef, useState } from "react";
import { MutableRefObject } from "react";
import { api } from "~/trpc/client";
import { ProjectObjective } from "~/server/db/schema";

export function createNewMarker(
  latitude: number,
  longitude: number,
  id: number,
  _map: google.maps.Map,
) {
  return new google.maps.marker.AdvancedMarkerElement({
    position: { lat: latitude, lng: longitude },
    map: _map,
    title: id.toString(),
    gmpDraggable: true,
  });
}

export const useMarkers = function (
  objectives: ProjectObjective[] | undefined,
  mapObject: google.maps.Map | null,
  _projectId: number,
  updatePolyline: () => void,
  debouncedObjectivesDataCacheInvalidation: MutableRefObject<() => void>,
) {
  const DEFAULT_ON_CREATION_ID = -1;

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

      objectiveCreationApiCall.mutate({
        projectId: _projectId,
        order: orderOfNewObjective,
        latitude: e.latLng.lat(),
        longitude: e.latLng.lng(),
      });

      document
        .getElementById("button-add-objective")
        ?.classList.remove(...cssButtonClasses);

      if (currentListener.current)
        google.maps.event.removeListener(currentListener.current);
    });
  }

  const apiUtils = api.useUtils();

  const objectiveCreationApiCall = api.objectives.create.useMutation({
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
      debouncedObjectivesDataCacheInvalidation.current();
    },
  });

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
      debouncedObjectivesDataCacheInvalidation.current();
    },
  });

  function deleteObjective(_order: number) {
    deleteMutationCall.mutate({ projectId: _projectId, order: _order });
  }

  // Change the order of objectives
  const orderChangeApiCall = api.objectives.changeOrder.useMutation({
    onMutate: async (variables) => {
      const previousObjectives =
        apiUtils.projects.fetchProjectObjectives.getData(_projectId);

      if (previousObjectives !== undefined) {
        const firstObjectiveToChange = previousObjectives.find(
          (obj) => obj.id === variables.firstProject.id,
        );
        const secondObjectiveToChange = previousObjectives.find(
          (obj) => obj.id === variables.secondProject.id,
        );

        if (
          firstObjectiveToChange !== undefined &&
          secondObjectiveToChange !== undefined
        ) {
          firstObjectiveToChange.order = variables.secondProject.order;
          secondObjectiveToChange.order = variables.firstProject.order;
        }

        apiUtils.projects.fetchProjectObjectives.setData(
          _projectId,
          previousObjectives,
        );

        updatePolyline();
      }

      return { previousObjectives };
    },
    onSettled: (data) => {
      debouncedObjectivesDataCacheInvalidation.current();
    },
  });

  function switchObjectiveOrder(objectiveId: number, displacement: number) {
    if (objectives === undefined) return;
    let objectivesList = [...objectives].sort(
      (a, b) => a.order - b.order,
    ) as ProjectObjective[];

    const firstObjectiveToChange = objectivesList.find(
      (obj) => obj.id === objectiveId,
    );

    if (firstObjectiveToChange === undefined) return;
    const firstObjectiveIndex = objectivesList.indexOf(firstObjectiveToChange);

    const secondObjectiveToChange =
      objectivesList[firstObjectiveIndex + displacement];

    if (secondObjectiveToChange === undefined) return;
    orderChangeApiCall.mutate({
      firstProject: {
        id: firstObjectiveToChange.id,
        order: firstObjectiveToChange.order,
      },
      secondProject: {
        id: secondObjectiveToChange.id,
        order: secondObjectiveToChange.order,
      },
    });
  }

  return {
    addObjectiveAndMarkerOnClickListener,
    deleteObjective,
    switchObjectiveOrder,
  };
};
