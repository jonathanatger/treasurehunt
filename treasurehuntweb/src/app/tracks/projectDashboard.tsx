"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/client";
import { Project } from "~/server/db/schema";
import { revalidate } from "~/lib/serverActions";
import Link from "next/link";
import { CircleChevronRight, CirclePlus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { SetStateAction, useEffect, useState } from "react";

export function ProjectDashboard({
  userprojects,
}: {
  userprojects: Project[] | undefined;
}) {
  const [isDeletingId, setIsDeletingId] = useState(0);

  return (
    <div className="h-full w-full">
      <div className="my-8 border-b-2 border-solid border-primary font-title text-3xl font-bold text-primary">
        VOS PISTES
      </div>
      <div className="flex max-w-[100%] flex-row flex-wrap items-center justify-center gap-8">
        {userprojects &&
          userprojects.map((prj) => (
            <ProjectCard
              title={prj.name ? prj.name : "projet sans titre"}
              id={prj.id}
              key={prj.id}
              setIsDeletingId={setIsDeletingId}
            />
          ))}
        <NewProjectCard />
        {isDeletingId !== 0 && (
          <ProjectDeletionModal
            isDeletingId={isDeletingId}
            setIsDeleting={setIsDeletingId}
          />
        )}
      </div>
    </div>
  );
}

function ProjectCard({
  title,
  id,
  setIsDeletingId,
}: {
  title: string;
  id: number;
  setIsDeletingId: React.Dispatch<SetStateAction<number>>;
}) {
  return (
    <Card className="relative flex h-40 w-64 flex-col justify-between rounded-3xl p-1 hover:opacity-90">
      <Link
        className="flex grow flex-col justify-between "
        href={`/tracks/${id}/partage`}
      >
        <CardHeader className="flex grow justify-between pb-2 pt-2">
          <CardTitle className="line-clamp-2 flex-wrap">{title}</CardTitle>
          <CircleChevronRight size={64} />
        </CardHeader>
      </Link>
      <Button
        onClick={() => {
          setIsDeletingId(id);
        }}
        className="absolute bottom-2 right-2 h-fit bg-transparent px-2 py-0 font-light hover:font-bold"
      >
        Supprimer
      </Button>
    </Card>
  );
}

function ProjectDeletionModal({
  setIsDeleting,
  isDeletingId,
}: {
  setIsDeleting: React.Dispatch<React.SetStateAction<number>>;
  isDeletingId: number;
}) {
  function close() {
    setIsDeleting(0);
  }

  const apiCall = api.projects.delete.useMutation();

  function deleteProject() {
    apiCall.mutate(
      { projectId: isDeletingId },
      {
        onError(err) {
          console.error(err);
        },
        async onSuccess() {
          await revalidate("/tracks").catch((err) => console.error(err));
          close();
        },
      },
    );
  }
  return (
    <dialog
      open
      className="pointer-events-auto fixed left-0 top-0 z-50 flex h-[100vh] w-[100vw] items-center justify-center bg-zinc-500/50"
    >
      <div
        onClick={close}
        className="absolute z-50 h-full w-full bg-transparent"
      />
      <div className="z-50 flex h-[200px] w-[300px] flex-col justify-between text-balance rounded-3xl bg-background p-4 text-center font-title">
        Etes vous certain de vouloir supprimer la piste ?
        <div className="flex flex-row justify-end space-x-4">
          <Button
            className="hover:underline active:animate-wiggle"
            onClick={() => {
              deleteProject();
            }}
          >
            Supprimer
          </Button>
          <Button
            onClick={close}
            className="bg-primary hover:bg-primary hover:underline"
          >
            Ne pas toucher à la piste
          </Button>
        </div>
      </div>
    </dialog>
  );
}

function NewProjectCard() {
  const newProject = api.projects.create.useMutation();

  function handleNewProjectClick(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) {
    newProject.mutate(
      {
        name: "Nouveau",
        description: "",
      },
      {
        onError() {
          console.error("An error occured");
        },
        async onSuccess() {
          await revalidate("/tracks");
        },
      },
    );
  }
  return (
    <Card
      className="h-40 w-64 cursor-pointer rounded-3xl bg-secondary opacity-30 hover:opacity-100"
      onClick={handleNewProjectClick}
    >
      <CardHeader className="flex h-full flex-col justify-between py-2">
        <CardTitle>
          <div>
            <h3 className="leading-6">Créer une nouvelle piste</h3>
          </div>
        </CardTitle>
        <CirclePlus size={64} strokeWidth={2}></CirclePlus>
      </CardHeader>
    </Card>
  );
}
