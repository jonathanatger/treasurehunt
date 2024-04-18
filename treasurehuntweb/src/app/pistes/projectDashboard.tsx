"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/client";
import { Project } from "~/server/db/schema";
import { revalidate } from "~/lib/serverActions";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { CirclePlus } from "lucide-react";

export function ProjectDashboard({
  userprojects,
}: {
  userprojects: Project[];
}) {
  return (
    <div className="h-full w-full rounded-md ">
      <div className="py-8 font-title text-3xl font-bold text-primary  underline">
        VOS PROJETS
      </div>
      <div className="flex max-w-[100%] flex-row flex-wrap items-center justify-start space-x-8">
        {userprojects &&
          userprojects.map((prj) => (
            <ProjectCard
              title={prj.name ? prj.name : "projet sans titre"}
              description={
                prj.description ? prj.description : "pas de description"
              }
              id={prj.id}
              key={prj.id}
            />
          ))}
        <NewProjectCard />
      </div>
    </div>
  );
}

function ProjectCard({
  title,
  newProjectBehavior,
  description,
  id,
}: {
  title: string;
  description: string;
  newProjectBehavior?: boolean;
  id: number;
}) {
  return (
    <Card className="h-40 w-64 cursor-pointer hover:scale-[1.05]">
      <Link href={`/pistes/${id}/partage`}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Link>
    </Card>
  );
}

function NewProjectCard() {
  const newProject = api.projects.create.useMutation();
  const { isLoaded, userId, sessionId, getToken } = useAuth();

  function handleNewProjectClick(e: any) {
    if (!isLoaded) throw new Error("User not authenticated");
    newProject.mutate(
      {
        name: "nouvo projet",
        description: "souper proje",
      },

      {
        onError() {
          console.error("An error occured");
        },
        onSuccess() {
          revalidate("/tableau");
        },
      },
    );
  }
  return (
    <Card
      className="h-40 w-64 cursor-pointer opacity-30 hover:scale-[1.05] hover:opacity-100"
      onClick={handleNewProjectClick}
    >
      <CardHeader>
        <CardTitle>Nouveau Projet</CardTitle>
        <CardDescription></CardDescription>
        <CirclePlus size={64} strokeWidth={2}></CirclePlus>
      </CardHeader>
    </Card>
  );
}
