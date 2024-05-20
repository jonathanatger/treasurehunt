import { ProjectObjective } from "~/server/db/schema";
import { Dispatch, SetStateAction, createContext, useState } from "react";

export const ObjectivesContext = createContext<objectiveContextType>(null);

type objectiveContextType = {
  mapObject: google.maps.Map | null;
  objectives: ProjectObjective[] | undefined;
  markers: {
    clientId: number;
    marker: google.maps.marker.AdvancedMarkerElement;
    listener: google.maps.MapsEventListener | null;
  }[];
  updatePolyline: () => void;
  deleteObjective: (order: number) => void;
  addObjectiveAndMarkerOnClickListener: (
    mapObject: google.maps.Map | null,
    setButtonMessage: Dispatch<SetStateAction<string>>,
  ) => void;
  switchObjectiveOrder: (currentId: number, displacement: number) => void;
  changeClueMessage: (clientId: number, text: string) => void;
  markerContent: (title: string, isHighlighted: boolean) => HTMLDivElement;
  cluesVisible: boolean;
  changeTitleOfObjective: (clientId: number, title: string) => void;
} | null;
