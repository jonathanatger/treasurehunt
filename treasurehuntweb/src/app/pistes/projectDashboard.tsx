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

export function ProjectDashboard({
  userprojects,
}: {
  userprojects: Project[];
}) {
  const { isLoaded } = useAuth();
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
              isLoaded={isLoaded}
            />
          ))}
        <NewProjectCard isLoaded={isLoaded} />
      </div>
    </div>
  );
}

function ProjectCard({
  title,
  id,
  isLoaded,
}: {
  title: string;
  id: number;
  isLoaded: boolean;
}) {
  const apiUtils = api.useUtils();
  const apiCall = api.projects.delete.useMutation();

  function deleteProject() {
    if (!isLoaded) throw new Error("User not authenticated");
    apiCall.mutate(
      { projectId: id },
      {
        onError(err) {
          console.error(err);
        },
        onSuccess() {
          revalidate("/pistes");
        },
      },
    );
  }
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
        onClick={deleteProject}
        className="absolute bottom-2 right-2 h-fit bg-transparent px-2 py-0 font-light hover:font-bold"
      >
        Supprimer
      </Button>
    </Card>
  );
}

function NewProjectCard({ isLoaded }: { isLoaded: boolean }) {
  const newProject = api.projects.create.useMutation();

  function handleNewProjectClick(e: any) {
    if (!isLoaded) throw new Error("User not authenticated");
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
