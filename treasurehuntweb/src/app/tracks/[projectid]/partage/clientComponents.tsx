"use client";
import { Clipboard } from "lucide-react";
import { Button } from "~/components/ui/button";
import { MutableRefObject, useRef, useState, useEffect, use } from "react";
import { api } from "~/trpc/client";
import { useProjects } from "~/lib/useProjects";
import { cn } from "~/lib/utils";

export function TitleChange({ projectId }: { projectId: number }) {
  const { data, isLoading, isFetching } =
    api.projects.fetchUserProjects.useQuery();
  const [clientTitle, setClientTitle] = useState<string>("");
  const [userHasFeedback, setUserHasFeedback] = useState<boolean>(false);

  useEffect(() => {
    const fetchedDataProjectTitle = data?.find(
      (project) => project.id === projectId,
    )?.name;

    if (fetchedDataProjectTitle) setClientTitle(fetchedDataProjectTitle);
  }, [isLoading]);

  const { debouncedSetTitleApiCall } = useProjects(projectId);

  function changeAndSetTitle(elem: React.ChangeEvent<HTMLInputElement>) {
    setClientTitle(elem.target.value);
    debouncedSetTitleApiCall(elem.target.value, setUserHasFeedback);
  }

  return (
    <input
      type="text"
      className={cn(
        "flex w-full resize-none items-center justify-center truncate rounded-3xl bg-background px-4 py-2 text-foreground sm:w-fit sm:grow md:text-2xl",
        userHasFeedback ? "bg-primary" : "",
      )}
      placeholder="Les mystérieuses cités d'or..."
      onChange={changeAndSetTitle}
      value={isLoading ? "..." : clientTitle}
    />
  );
}

export function LinkToClipboardCard({ projectId }: { projectId: number }) {
  const { data, isLoading, isFetching } =
    api.projects.fetchUserProjects.useQuery();
  const currentRaceId = data?.find(
    (project) => project.id === projectId,
  )?.currentRace;
  const link = `join${currentRaceId}`;
  async function copyLink(e: React.FormEvent<HTMLButtonElement>) {
    if (isLoading) return;
    await navigator.clipboard
      .writeText(link)
      .catch((err) => console.error(err));
    const textElement = document.getElementById("clipboard-link")!;
    textElement.innerHTML = "Copié !";
    setTimeout(() => {
      textElement.innerHTML = link;
    }, 1000);
  }
  return (
    <Button
      className="flex h-fit flex-col rounded-full bg-secondary px-6 py-2 shadow-lg focus:ring-blue-300 active:outline active:outline-2 active:outline-secondary"
      onClick={copyLink}
    >
      <div className="flex w-full flex-row items-center justify-between">
        <h3 className="font-title text-2xl">Copier le lien</h3>
        <Clipboard></Clipboard>
      </div>
      {isLoading ? (
        <h3 className="text-secondary">.</h3>
      ) : (
        <h3 className="appear-animation" id="clipboard-link">
          {link}
        </h3>
      )}
    </Button>
  );
}
