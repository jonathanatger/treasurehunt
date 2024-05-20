import { ProjectDashboard } from "./projectDashboard";
import type { Project } from "~/server/db/schema";
import { api } from "~/trpc/server";

export default async function Page() {
  const userprojects: Project[] = await api.projects.fetchUserProjects();

  return (
    <>
      <main className="top-12 h-[100svh] w-[100%] overflow-auto">
        <section className="box-border h-[calc(100%-3rem)] ">
          <ProjectDashboard userprojects={userprojects} />
          <h3 className="text-center">
            Connectez-vous pour voir vos pistes ici.
          </h3>
        </section>
      </main>
    </>
  );
}