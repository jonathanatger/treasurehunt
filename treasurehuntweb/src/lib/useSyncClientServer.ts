import { useEffect, useRef, MutableRefObject } from "react";
import { ProjectObjective } from "~/server/db/schema";
import { api } from "~/trpc/client";

export const useSyncClientAndServerState = function (
  objectives: ProjectObjective[] | undefined,
  mapObject: google.maps.Map | null,
  _projectId: number,
  markers: google.maps.marker.AdvancedMarkerElement[],
  setMarkers: React.Dispatch<google.maps.marker.AdvancedMarkerElement[]>,
) {
  function createNewMarker(
    _latitude: number,
    _longitude: number,
    _clientId: number,
    _map: google.maps.Map,
  ) {
    const draggableMarker = new google.maps.marker.AdvancedMarkerElement({
      position: { lat: _latitude, lng: _longitude },
      map: _map,
      title: _clientId.toString(),
      gmpDraggable: true,
    });

    draggableMarker.addListener("dragend", (event: any) => {
      const position = draggableMarker.position as google.maps.LatLngLiteral;
      objectivePositionChangeApiCall.mutate({
        clientId: _clientId,
        projectId: _projectId,
        latitude: position.lat,
        longitude: position.lng,
      });
    });
    return draggableMarker;
  }

  const objectivePositionChangeApiCall =
    api.objectives.changePosition.useMutation({
      onMutate: async (variables) => {
        const previousObjectives = objectives;
        const newObjectives = structuredClone(objectives as ProjectObjective[]);

        const associateObjective = newObjectives.find(
          (obj) => obj.clientId === variables.clientId,
        );

        if (associateObjective === undefined) return;
        associateObjective.latitude = variables.latitude;
        associateObjective.longitude = variables.longitude;

        apiUtils.projects.fetchProjectObjectives.setData(
          _projectId,
          newObjectives,
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

  const generateClientId = (objectives: ProjectObjective[]) => {
    return objectives.reduce<number>((acc, value) => {
      return value.clientId === acc || value.clientId > acc
        ? (acc = value.clientId + 1)
        : acc;
    }, 0);
  };
  // on the objectives change, synchronize the markers in
  // a declarative way :
  // creation/mutation/deletion and save in `markers` state
  useEffect(() => {
    let markersToSet: Array<google.maps.marker.AdvancedMarkerElement> = [];

    // create markers when a new objective appears
    objectives?.forEach((obj) => {
      const correspondingMarker = markers.find(
        (marker) => marker.title === obj.clientId.toString(),
      );

      if (correspondingMarker === undefined) {
        const newMarker = createNewMarker(
          obj.latitude,
          obj.longitude,
          obj.clientId,
          mapObject as google.maps.Map,
        );
        markersToSet.push(newMarker);
        return;
      }
      //

      if (
        correspondingMarker.position?.lat !== obj.latitude ||
        correspondingMarker.position?.lng !== obj.longitude
      ) {
        correspondingMarker.position = {
          lat: obj.latitude,
          lng: obj.longitude,
        };
      }

      markersToSet.push(correspondingMarker);
    });

    // check if some markers are left without an objective
    markers.forEach((previousMarker) => {
      let check = true;

      if (objectives === undefined || objectives.length === 0) {
        previousMarker.map = null;
        return;
      }

      objectives.forEach((obj) => {
        if (obj.clientId.toString() === previousMarker.title) check = false;
      });

      if (check) {
        previousMarker.map = null;
      }
    });

    setMarkers(markersToSet);
  }, [objectives]);

  // Debouncing the cache invalidation to not have old server data appear in the middle
  // of multiple client state changes
  const apiUtils = api.useUtils();

  const debouncedObjectivesDataCacheInvalidation = useRef(
    constructorDebouncedObjectivesDataCacheInvalidation(),
  );

  function constructorDebouncedObjectivesDataCacheInvalidation() {
    let timeout: string | number | NodeJS.Timeout | undefined;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        apiUtils.projects.fetchProjectObjectives.invalidate();
      }, 3000);
    };
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
    updatePolyline,
    debouncedObjectivesDataCacheInvalidation,
    generateClientId,
  };
};
