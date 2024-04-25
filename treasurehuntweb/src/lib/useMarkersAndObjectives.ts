import { SetStateAction, useRef } from "react";
import { MutableRefObject } from "react";
import { api } from "~/trpc/client";
import { ProjectObjective, projectObjectives } from "~/server/db/schema";

export const useMarkersAndObjectives = function (
  objectives: ProjectObjective[] | undefined,
  mapObject: google.maps.Map | null,
  _projectId: number,
  debouncedObjectivesDataCacheInvalidation: MutableRefObject<() => void>,
  updatePolyline: () => void,
  generateClientId: (objectives: ProjectObjective[]) => number,
) {
  const DEFAULT_ON_CREATION_ID = -1;
  const DEFAULT_ON_CREATION_ORDER = 1;

  // Add new objective, with a click on the map.
  // step 1 : create listener on the map, to get the click
  // step 2 : listener triggers callback, place a marker, pans the map to the point
  // step 3 : db call, with optimistic state update and correction should there be a problem

  const currentMapsEventListener: MutableRefObject<google.maps.MapsEventListener | null> =
    useRef(null);

  function addObjectiveAndMarkerOnClickListener(
    mapObject: google.maps.Map | null,
    setButtonMessage: React.Dispatch<SetStateAction<string>>,
  ) {
    if (mapObject === null) return;
    const cssButtonClasses = ["animate-pulse", "hover:bg-secondary"];
    const buttonToModify = document.getElementById("button-add-objective");

    buttonToModify?.classList.add(...cssButtonClasses);

    mapObject.setOptions({
      draggableCursor: "crosshair",
    });

    setButtonMessage("Cliquez sur la carte");

    currentMapsEventListener.current = mapObject?.addListener(
      "click",
      (e: google.maps.MapMouseEvent) => {
        let orderOfNewObjective: number;
        let _clientIdOfNewObjective: number;

        if (objectives === undefined) {
          orderOfNewObjective = 0;
          _clientIdOfNewObjective = 0;
        } else {
          orderOfNewObjective = objectives.reduce<number>((acc, value) => {
            if (value.order >= acc) {
              return value.order + 1;
            } else {
              return acc;
            }
          }, DEFAULT_ON_CREATION_ORDER);

          _clientIdOfNewObjective = generateClientId(objectives);
        }

        if (!e.latLng) return;

        mapObject.panTo(e.latLng);
        mapObject.setOptions({ draggableCursor: "" });

        objectiveCreationApiCall.mutate({
          projectId: _projectId,
          clientId: _clientIdOfNewObjective,
          title: "Objectif " + _clientIdOfNewObjective.toString(),
          order: orderOfNewObjective,
          latitude: e.latLng.lat(),
          longitude: e.latLng.lng(),
        });

        setButtonMessage("Ajouter un objectif sur la carte");

        document
          .getElementById("button-add-objective")
          ?.classList.remove(...cssButtonClasses);

        if (currentMapsEventListener.current)
          google.maps.event.removeListener(currentMapsEventListener.current);
      },
    );
  }

  const apiUtils = api.useUtils();

  const objectiveCreationApiCall = api.objectives.create.useMutation({
    onMutate: (newObjective) => {
      const previousObjectives =
        apiUtils.projects.fetchProjectObjectives.getData(_projectId);

      let newData: ProjectObjective[];

      if (previousObjectives === undefined) newData = [];
      else {
        const tempId = generateClientId(previousObjectives);

        newData = [
          ...previousObjectives,
          {
            id: DEFAULT_ON_CREATION_ID,
            clientId: tempId,
            projectid: newObjective.projectId,
            title: newObjective.title,
            latitude: newObjective.latitude,
            longitude: newObjective.longitude,
            order: newObjective.order,
            message: "",
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
          obj.clientId !== variables.clientId,
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

  function deleteObjective(clientId: number) {
    const objectiveToDelete = objectives?.find(
      (obj) => obj.clientId === clientId,
    );

    if (objectiveToDelete === undefined) {
      console.error("No objective with that clientId number");
      return;
    }

    deleteMutationCall.mutate({
      projectId: _projectId,
      clientId: objectiveToDelete.clientId,
    });
  }

  // Change the order of objectives
  const orderChangeApiCall = api.objectives.changeOrder.useMutation({
    onMutate: async (variables) => {
      const previousObjectives =
        apiUtils.projects.fetchProjectObjectives.getData(_projectId);

      if (previousObjectives !== undefined) {
        const firstObjectiveToChange = previousObjectives.find(
          (obj) => obj.clientId === variables.firstProject.clientId,
        );
        const secondObjectiveToChange = previousObjectives.find(
          (obj) => obj.clientId === variables.secondProject.clientId,
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
    onError: (err, variables, context) => {
      apiUtils.projects.fetchProjectObjectives.setData(
        _projectId,
        context?.previousObjectives,
      );

      console.error(err);
    },
    onSettled: (data) => {
      debouncedObjectivesDataCacheInvalidation.current();
    },
  });

  function switchObjectiveOrder(
    objectiveClientId: number,
    displacement: number,
  ) {
    if (objectives === undefined) return;
    const objectivesList = [...objectives].sort((a, b) => a.order - b.order);

    const firstObjectiveToChange = objectivesList.find(
      (obj) => obj.clientId === objectiveClientId,
    );

    if (firstObjectiveToChange === undefined) return;
    const firstObjectiveIndex = objectivesList.indexOf(firstObjectiveToChange);

    const secondObjectiveToChange =
      objectivesList[firstObjectiveIndex + displacement];

    if (secondObjectiveToChange === undefined) return;
    orderChangeApiCall.mutate({
      projectId: _projectId,
      firstProject: {
        clientId: firstObjectiveToChange.clientId,
        order: firstObjectiveToChange.order,
      },
      secondProject: {
        clientId: secondObjectiveToChange.clientId,
        order: secondObjectiveToChange.order,
      },
    });
  }

  // Change the clue message of objectives
  const clueMessageChangeApiCall = api.objectives.changeClueMessage.useMutation(
    {
      onMutate: async (variables) => {
        const previousObjectives =
          apiUtils.projects.fetchProjectObjectives.getData(_projectId);

        if (previousObjectives === undefined) return;
        const ObjectiveToChange = previousObjectives.find(
          (obj) => obj.clientId === variables.clientId,
        );

        if (ObjectiveToChange) ObjectiveToChange.message = variables.text;

        apiUtils.projects.fetchProjectObjectives.setData(
          _projectId,
          previousObjectives,
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

      onSettled: (data) => {
        debouncedObjectivesDataCacheInvalidation.current();
      },
    },
  );

  function changeClueMessage(objectiveClientId: number, _text: string) {
    if (objectiveClientId !== undefined && _text !== undefined)
      clueMessageChangeApiCall.mutate({
        projectId: _projectId,
        clientId: objectiveClientId,
        text: _text,
      });
  }

  // change the title of an objective ---------------
  const changeObjectiveTitleApiCall = api.objectives.changeTitle.useMutation({
    onMutate: async (variables) => {
      const previousObjectives =
        apiUtils.projects.fetchProjectObjectives.getData(_projectId);

      if (previousObjectives === undefined) return;
      const ObjectiveToChange = previousObjectives.find(
        (obj) => obj.clientId === variables.clientId,
      );

      if (ObjectiveToChange) ObjectiveToChange.title = variables.title;

      apiUtils.projects.fetchProjectObjectives.setData(
        _projectId,
        previousObjectives,
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

    onSettled: (data) => {
      debouncedObjectivesDataCacheInvalidation.current();
    },
  });

  function changeTitleOfObjective(objectiveClientId: number, _title: string) {
    if (objectiveClientId !== undefined && _title !== undefined) {
      changeObjectiveTitleApiCall.mutate({
        title: _title,
        clientId: objectiveClientId,
        projectId: _projectId,
      });
    }
  }

  return {
    addObjectiveAndMarkerOnClickListener,
    deleteObjective,
    switchObjectiveOrder,
    updatePolyline,
    changeClueMessage,
    changeTitleOfObjective,
  };
};
