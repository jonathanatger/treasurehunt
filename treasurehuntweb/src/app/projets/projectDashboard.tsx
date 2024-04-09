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

export function ProjectDashboard({
  userprojects,
}: {
  userprojects: Project[];
}) {
  //wiki-devel.sugarlabs.org/images/e/e2/Arrow.cur  // const synchronizer = useRef(new serverSynchronizer("message"));

  p: return (
    <div className="h-full rounded-md outline outline-slate-700">
      <div className="py-8 font-title text-3xl">VOS PROJETS</div>
      <div className="flex flex-row flex-wrap pb-8">
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
    <Card className="mb-8 mr-8 w-64 cursor-pointer hover:scale-[1.05]">
      <Link href={`/tableau/projet/${id}/carte`}>
        <div
          className={cn(
            "h-8 w-full rounded-lg ",
            newProjectBehavior ? "bg-red-300" : "bg-gray-300",
          )}
        ></div>
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

  function handleNewProjectClick(e: any) {
    newProject.mutate(
      {
        name: "nouvo projet",
        description: "souper proje",
        userId: 1,
      },
      {
        onSuccess() {
          revalidate("/tableau");
        },
      },
    );
  }
  return (
    <Card
      className={cn(
        "mb-8 mr-8 w-64 cursor-pointer hover:scale-[1.05]",
        "opacity-30 hover:opacity-100",
      )}
      onClick={handleNewProjectClick}
    >
      <div className={cn("h-8 w-full rounded-lg ", "bg-red-300")}></div>
      <CardHeader>
        <CardTitle>Nouveau Projet</CardTitle>
        <CardDescription></CardDescription>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="50"
          height="50"
          viewBox="0 0 50 50"
        >
          <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24 13 L 24 24 L 13 24 L 13 26 L 24 26 L 24 37 L 26 37 L 26 26 L 37 26 L 37 24 L 26 24 L 26 13 L 24 13 z"></path>
        </svg>
      </CardHeader>
    </Card>
  );
}
