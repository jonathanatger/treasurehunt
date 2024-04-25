"use client";
import { Clipboard } from "lucide-react";
import { Button } from "~/components/ui/button";
import { MutableRefObject, useRef, useState, useEffect, use } from "react";
import { api } from "~/trpc/client";
import { useProjects } from "~/lib/useProjects";

export function TitleChange({ projectId }: { projectId: number }) {
  const { data, isLoading } = api.projects.fetchUserProjects.useQuery();
  const [clientTitle, setClientTitle] = useState<string>("");

  useEffect(() => {
    if (isLoading) return;

    const fetchedDataProjectTitle = data?.find(
      (project) => project.id === projectId,
    )?.name;
    if (fetchedDataProjectTitle) setClientTitle(fetchedDataProjectTitle);
  }, [isLoading]);

  const { debouncedSetTitleApiCall } = useProjects(projectId);

  function changeAndSetTitle(elem: React.ChangeEvent<HTMLInputElement>) {
    setClientTitle(elem.target.value);
    debouncedSetTitleApiCall(elem.target.value);
  }

  return (
    <input
      type="text"
      className="flex grow resize-none items-center justify-center truncate rounded-3xl bg-background px-4 py-2 text-2xl text-foreground"
      placeholder="Les mystérieuses cités d'or..."
      onChange={changeAndSetTitle}
      value={isLoading ? "Chargement..." : clientTitle}
    />
  );
}

export function LinkToClipboardCard({ projectId }: { projectId: string }) {
  const link = `www.treasurio.com/rejoindre/${projectId}`;
  async function copyLink(e: React.FormEvent<HTMLButtonElement>) {
    await navigator.clipboard
      .writeText(link)
      .catch((err) => console.error(err));
    const textElement = document.getElementById("clipboard-link")!;
    textElement.innerHTML = "Copié !";
    textElement.classList.add("font-bold");
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
      <h3 id="clipboard-link">{link}</h3>
    </Button>
  );
}
