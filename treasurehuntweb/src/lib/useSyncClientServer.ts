import { linkSync } from "fs";
import { useEffect, useRef, MutableRefObject } from "react";
import { ProjectObjective } from "~/server/db/schema";
import { api } from "~/trpc/client";

export const useSyncClientAndServerState = function (
  objectives: ProjectObjective[] | undefined,
  mapObject: google.maps.Map | null,
  _projectId: number,
  markers: {
    clientId: number;
    marker: google.maps.marker.AdvancedMarkerElement;
    listener: google.maps.MapsEventListener | null;
  }[],
  setMarkers: React.Dispatch<
    {
      clientId: number;
      marker: google.maps.marker.AdvancedMarkerElement;
      listener: google.maps.MapsEventListener | null;
    }[]
  >,
  markerContent: (title: string, isHighlighted: boolean) => HTMLDivElement,
  areMarkersDraggable: boolean,
  apiImportsAreLoading: boolean,
) {
  const DEFAULT_ON_CREATION_CLIENT_ID = 1;

  // on the objectives change, synchronize the markers in
  // a declarative way :
  // creation/mutation/deletion and save in `markers` state.
  // Additionnally, update the listeners of the markers to take
  // the new coordinates into account and update the polyline
  useEffect(() => {
    const markersToSet: Array<{
      clientId: number;
      marker: google.maps.marker.AdvancedMarkerElement;
      listener: google.maps.MapsEventListener | null;
    }> = [];

    if (apiImportsAreLoading) return;

    // create markers when a new objective appears
    objectives?.forEach((obj) => {
      const correspondingMarker = markers.find(
        (marker) => marker.clientId === obj.clientId,
      );

      if (correspondingMarker === undefined) {
        const newMarker = createNewMarker(
          obj.latitude,
          obj.longitude,
          obj.clientId,
          mapObject!,
          obj.title,
          areMarkersDraggable,
        );
        markersToSet.push({
          clientId: obj.clientId,
          marker: newMarker,
          listener: null,
        });
        return;
      }

      if (
        correspondingMarker.marker.position?.lat !== obj.latitude ||
        correspondingMarker.marker.position?.lng !== obj.longitude
      ) {
        correspondingMarker.marker.position = {
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
        previousMarker.marker.map = null;
        return;
      }

      objectives.forEach((obj) => {
        if (obj.clientId === previousMarker.clientId) check = false;
      });

      if (check) previousMarker.marker.map = null;
    });

    markersToSet.forEach((marker) => (marker.marker.map = mapObject));

    setMarkers(markersToSet);

    updatePolyline();
    refreshMarkerListeners();
  }, [objectives, mapObject, apiImportsAreLoading]);

  const generateClientId = (objectives: ProjectObjective[]) => {
    return objectives.reduce<number>((acc, value) => {
      return value.clientId === acc || value.clientId > acc
        ? (acc = value.clientId + 1)
        : acc;
    }, DEFAULT_ON_CREATION_CLIENT_ID);
  };

  const objectivePositionChangeApiCall =
    api.objectives.changePosition.useMutation({
      onMutate: async (variables) => {
        const previousObjectives = objectives;
        const newObjectives = structuredClone(objectives!);

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

  // create a new Marker. Listeners are added to each state of a drag and drop
  // event, as to update the coordinates correctly
  function createNewMarker(
    _latitude: number,
    _longitude: number,
    _clientId: number,
    _map: google.maps.Map,
    _title: string,
    areMarkersDraggable: boolean,
  ) {
    const draggableMarker = new google.maps.marker.AdvancedMarkerElement({
      position: { lat: _latitude, lng: _longitude },
      map: _map,
      title: _title,
      gmpDraggable: areMarkersDraggable,
      content: markerContent(_title, false),
    });
    draggableMarker.addListener(
      "dragstart",
      (event: google.maps.MapMouseEvent) => {
        clearTimeout(debouncedObjectivesDataCacheInvalidationTimeout.current);
      },
    );

    addDragListener(draggableMarker, _clientId);

    draggableMarker.addListener(
      "dragend",
      (event: google.maps.MapMouseEvent) => {
        const position = draggableMarker.position as google.maps.LatLngLiteral;
        objectivePositionChangeApiCall.mutate({
          clientId: _clientId,
          projectId: _projectId,
          latitude: position.lat,
          longitude: position.lng,
        });
      },
    );

    return draggableMarker;
  }

  function addDragListener(
    _marker: google.maps.marker.AdvancedMarkerElement,
    markerClientId: number,
  ) {
    const listener = _marker.addListener(
      "drag",
      (event: google.maps.MapMouseEvent) => {
        const position = _marker.position as google.maps.LatLngLiteral;
        const correspondingObjective = objectives?.find(
          (obj) => obj.clientId === markerClientId,
        );
        if (correspondingObjective === undefined) return;
        correspondingObjective.latitude = position.lat;
        correspondingObjective.longitude = position.lng;

        updatePolyline();
      },
    );

    return listener;
  }

  function refreshMarkerListeners() {
    // refresh the eventlisteners, as each listener saves the current positions of
    // other markers when it is declared
    markers.forEach((marker) => {
      if (marker.listener !== null) {
        marker.listener.remove();
      }

      marker.listener = addDragListener(marker.marker, marker.clientId);
    });
  }

  // Debouncing the cache invalidation to not have old server data appear in the middle
  // of multiple client state changes
  const apiUtils = api.useUtils();

  const debouncedObjectivesDataCacheInvalidationTimeout: MutableRefObject<
    string | number | NodeJS.Timeout | undefined
  > = useRef(0);

  const debouncedObjectivesDataCacheInvalidation = useRef(
    constructorDebouncedObjectivesDataCacheInvalidation(),
  );

  function constructorDebouncedObjectivesDataCacheInvalidation() {
    return () => {
      clearTimeout(debouncedObjectivesDataCacheInvalidationTimeout.current);
      debouncedObjectivesDataCacheInvalidationTimeout.current = setTimeout(
        async () => {
          await apiUtils.projects.fetchProjectObjectives.invalidate();
          return;
        },
        3000,
      );
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
      strokeColor: "#c03f0c",
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });

    polyline.setMap(mapObject);
    polylineRef.current = polyline;
  }

  return {
    updatePolyline,
    debouncedObjectivesDataCacheInvalidation,
    generateClientId,
  };
};
