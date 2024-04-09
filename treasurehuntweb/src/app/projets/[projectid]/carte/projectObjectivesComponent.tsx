import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ProjectObjective } from "~/server/db/schema";

export function ProjectObjectivesComponent({
  objectives,
  markers,
  mapObject,
  deleteObjective,
  switchObjectiveOrder,
  addObjectiveAndMarkerOnClickListener,
  markerContent,
}: {
  objectives: ProjectObjective[] | undefined;
  markers: {
    clientId: number;
    marker: google.maps.marker.AdvancedMarkerElement;
    listener: google.maps.MapsEventListener | null;
  }[];
  mapObject: google.maps.Map | null;
  deleteObjective: (order: number) => void;
  switchObjectiveOrder: (
    firstProjectOrder: number,
    secondProjectOrder: number,
  ) => void;
  addObjectiveAndMarkerOnClickListener: (
    mapObject: google.maps.Map | null,
  ) => void;
  markerContent: (title: string, isHighlighted: boolean) => HTMLDivElement;
}) {
  return (
    <>
      <div className="px-2 py-8">
        <div className="flex w-full flex-col">
          {objectives &&
            objectives
              .sort((a, b) => {
                return a.order - b.order;
              })
              .map((objective) => (
                <ObjectiveCard
                  key={"objective-card-" + objective.clientId.toString()}
                  markers={markers}
                  clientId={objective.clientId}
                  title={objective.title}
                  order={objective.order}
                  deleteObjective={deleteObjective}
                  switchObjectiveOrder={switchObjectiveOrder}
                  latitude={objective.latitude}
                  longitude={objective.longitude}
                  markerContent={markerContent}
                />
              ))}
          <Button
            className="h-32"
            id="button-add-objective"
            onClick={() => {
              addObjectiveAndMarkerOnClickListener(mapObject);
            }}
          >
            Ajouter un objectif
          </Button>
        </div>
      </div>
    </>
  );
}

function ObjectiveCard({
  markers,
  clientId,
  title,
  order,
  deleteObjective,
  switchObjectiveOrder,
  latitude,
  longitude,
  markerContent,
}: {
  markers: {
    clientId: number;
    marker: google.maps.marker.AdvancedMarkerElement;
    listener: google.maps.MapsEventListener | null;
  }[];
  clientId: number;
  title: string;
  order: number;
  deleteObjective: (order: number) => void;
  switchObjectiveOrder: (currentId: number, displacement: number) => void;
  latitude: number;
  longitude: number;
  markerContent: (title: string, isHighlighted: boolean) => HTMLDivElement;
}) {
  function highlightMarker(isHighlighted: boolean) {
    const correspondingMarker = markers.find(
      (marker) => marker.clientId === clientId,
    )?.marker;

    if (correspondingMarker === undefined) return;
    correspondingMarker.content = markerContent(title, isHighlighted);
  }

  return (
    <Card
      className="mb-2 flex w-full flex-row"
      onMouseEnter={() => highlightMarker(true)}
      onMouseLeave={() => highlightMarker(false)}
    >
      <div className="flex w-12 flex-col ">
        <Button
          className="m-1 flex-1 bg-slate-700"
          onClick={() => {
            highlightMarker(false);
            switchObjectiveOrder(clientId, -1);
          }}
        >
          Up
        </Button>
        <Button
          className="m-1 flex-1 bg-slate-700"
          onClick={() => {
            highlightMarker(false);
            switchObjectiveOrder(clientId, 1);
          }}
        >
          Down
        </Button>
      </div>
      <div>
        <CardHeader className="flex flex-row items-center justify-between ">
          <div className="h-8">{title}</div>
          <Button
            className="h-8 w-4 bg-red-500"
            onClick={() => deleteObjective(clientId)}
          >
            X
          </Button>
        </CardHeader>
        <CardContent>
          <CardDescription>
            lat : {latitude.toString()} et long : {longitude.toString()}
          </CardDescription>
        </CardContent>
      </div>
    </Card>
  );
}
