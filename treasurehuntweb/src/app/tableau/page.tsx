import { ProjectDashboard } from "./projectDashboard";
import { Project } from "~/server/db/schema";
import { api } from "~/trpc/server";

export default async function Page() {
  const userprojects: Project[] = await api.projects.fetchUserProjects();

  return (
    <>
      <main className="top-12 h-[100svh] w-[100vw] overflow-auto">
        <section className="box-border h-[calc(100%-3rem)] w-full p-4">
          <ProjectDashboard userprojects={userprojects} />
        </section>
      </main>
    </>
  );
}
