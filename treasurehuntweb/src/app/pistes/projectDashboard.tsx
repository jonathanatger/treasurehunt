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
import { useAuth } from "@clerk/nextjs";
import { CirclePlus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "~/lib/utils";

export function ProjectDashboard({
  userprojects,
}: {
  userprojects: Project[];
}) {
  return (
    <div className="h-full w-full rounded-md ">
      <div className="py-8 font-title text-3xl font-bold text-primary underline">
        VOS PISTES
      </div>
      <div className="flex max-w-[100%] flex-row flex-wrap items-center justify-start gap-8">
        {userprojects &&
          userprojects.map((prj) => (
            <ProjectCard
              title={prj.name ? prj.name : "projet sans titre"}
              id={prj.id}
              key={prj.id}
            />
          ))}
        <NewProjectCard />
      </div>
    </div>
  );
}

function ProjectCard({ title, id }: { title: string; id: number }) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <Card className="relative flex h-40 w-64 flex-col justify-between p-1">
      <Link
        className="flex grow flex-col justify-between"
        href={`/pistes/${id}/partage`}
      >
        <CardHeader className="pb-0">
          <CardTitle className="line-clamp-3 flex-wrap">{title}</CardTitle>
        </CardHeader>
      </Link>
      <Button
        onClick={() => {
          setIsDeleting((prev) => !prev);
          console.log("click", isDeleting);
        }}
        className="absolute bottom-2 right-2 h-fit bg-transparent px-2 py-0 font-light hover:font-bold"
      >
        Supprimer
      </Button>
      {isDeleting && (
        <ProjectDeletionPage id={id} setIsDeleting={setIsDeleting} />
      )}
    </Card>
  );
}

function ProjectDeletionPage({
  setIsDeleting,
  id,
}: {
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
}) {
  function close() {
    setIsDeleting((prev) => !prev);
  }

  const apiCall = api.projects.delete.useMutation();

  function deleteProject() {
    apiCall.mutate(
      { projectId: id },
      {
        onError(err) {
          console.error(err);
        },
        onSuccess() {
          revalidate("/pistes");
          setIsDeleting((prev) => !prev);
        },
      },
    );
  }
  return (
    <dialog
      open
      className="fixed left-0 top-0 z-50 flex h-[100vh] w-[100vw] items-center justify-center bg-zinc-500/50"
    >
      <div onClick={close} className="absolute h-full w-full bg-transparent" />
      <div className="z-50 flex h-[200px] w-[300px] flex-col justify-between text-balance rounded-3xl bg-background p-4 text-center font-title">
        Etes vous certain de vouloir supprimer la piste ?
        <div className="flex flex-row justify-end space-x-4">
          <Button
            className="active:animate-wiggle"
            onClick={() => {
              deleteProject();
            }}
          >
            Supprimer
          </Button>
          <Button onClick={close} className="bg-primary">
            Ne pas toucher à la piste
          </Button>
        </div>
      </div>
    </dialog>
  );
}

function NewProjectCard() {
  const newProject = api.projects.create.useMutation();

  function handleNewProjectClick(e: any) {
    newProject.mutate(
      {
        name: "Nouveau",
        description: "",
      },
      {
        onError() {
          console.error("An error occured");
        },
        onSuccess() {
          revalidate("/pistes");
        },
      },
    );
  }
  return (
    <Card
      className="h-40 w-64 cursor-pointer bg-secondary opacity-30  hover:opacity-100"
      onClick={handleNewProjectClick}
    >
      <CardHeader>
        <CardTitle>
          <div>
            <h3 className="leading-6">Créer une nouvelle piste</h3>
          </div>
        </CardTitle>
        <CardDescription></CardDescription>
        <CirclePlus size={64} strokeWidth={2}></CirclePlus>
      </CardHeader>
    </Card>
  );
}
