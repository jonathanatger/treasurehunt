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
  mapObject,
  deleteObjective,
  changeObjectiveOrder,
  addObjectiveAndMarkerOnClickListener,
}: {
  objectives: ProjectObjective[] | undefined;
  mapObject: google.maps.Map | null;
  deleteObjective: (order: number) => void;
  changeObjectiveOrder: (
    firstProjectOrder: number,
    secondProjectOrder: number,
  ) => void;
  addObjectiveAndMarkerOnClickListener: (
    mapObject: google.maps.Map | null,
  ) => void;
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
                  key={objective.order.toString()}
                  order={objective.order}
                  deleteObjective={deleteObjective}
                  changeObjectiveOrder={changeObjectiveOrder}
                  latitude={objective.latitude}
                  longitude={objective.longitude}
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
  order,
  deleteObjective,
  changeObjectiveOrder,
  latitude,
  longitude,
}: {
  order: number;
  deleteObjective: (order: number) => void;
  changeObjectiveOrder: (currentOrder: number, newOrder: number) => void;
  latitude: number;
  longitude: number;
}) {
  return (
    <Card className="mb-2 flex w-full flex-row">
      <div className="flex w-12 flex-col ">
        <Button
          className="m-1 flex-1 bg-slate-700"
          onClick={() => {
            changeObjectiveOrder(order - 1, order);
          }}
        >
          Up
        </Button>
        <Button
          className="m-1 flex-1 bg-slate-700"
          onClick={() => {
            changeObjectiveOrder(order, order + 1);
          }}
        >
          Down
        </Button>
      </div>
      <div>
        <CardHeader className="flex flex-row items-center justify-between ">
          <div className="h-8">Objectif {order.toString()}</div>
          <Button
            className="h-8 w-4 bg-red-500"
            onClick={() => deleteObjective(order)}
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
