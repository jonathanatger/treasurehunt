import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useEffect, SetStateAction, useRef } from "react";
import { simplifiedProjectObjective } from "./page";
import { useMarkers } from "~/lib/useMarkers";
import { useContext } from "react";
import { QueryClientContext } from "@tanstack/react-query";
import { ProjectObjective } from "~/server/db/schema";

export function ProjectObjectivesComponent({
  objectives,
  mapObject,
  projectId,
}: {
  objectives: ProjectObjective[] | undefined;
  mapObject: google.maps.Map | null;
  projectId: number;
}) {
  const queryClient = useContext(QueryClientContext);
  const {
    deleteObjective,
    addMarkerOnClickListener,
    changeObjectiveOrder,
    updatePolyline,
  } = useMarkers(objectives, mapObject, projectId, queryClient);

  useEffect(() => {
    updatePolyline();
  }, [objectives]);

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
              addMarkerOnClickListener(mapObject);
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
  deleteObjective: Function;
  changeObjectiveOrder: Function;
  latitude: number;
  longitude: number;
}) {
  return (
    <Card className="mb-2 flex w-full flex-row">
      <div className="flex w-12 flex-col ">
        <Button
          className="m-1 flex-1 bg-slate-700"
          onClick={() => {
            changeObjectiveOrder(order, order - 1);
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
