import { api } from "~/trpc/client";
import { useRef, MutableRefObject, SetStateAction } from "react";
import { Router } from "next/router";
import { revalidate } from "./serverActions";

export function useProjects(projectId: number) {
  const apiUtils = api.useUtils();

  const changeTitleApiCall = api.projects.changeTitle.useMutation({
    onMutate: (variables) => {
      const previousProjects = apiUtils.projects.fetchUserProjects.getData();

      if (previousProjects === undefined) return previousProjects;

      const projectToRename = previousProjects.find(
        (prj) => prj.id === variables.projectId,
      );

      if (projectToRename) projectToRename.name = variables.title;

      apiUtils.projects.fetchUserProjects.setData(undefined, previousProjects);

      return { previousProjects };
    },

    onError: (err, variables, context) => {
      apiUtils.projects.fetchUserProjects.setData(
        undefined,
        context?.previousProjects,
      );

      console.error(err);
    },
    onSettled: async () => {
      await apiUtils.projects.fetchUserProjects.invalidate();
      await revalidate("/tracks");
    },
  });

  const debouncedTimeout: MutableRefObject<Timer | undefined> = useRef();

  function debouncedSetTitleApiCall(
    _message: string,
    setUserHasFeedback: React.Dispatch<SetStateAction<boolean>>,
  ) {
    clearTimeout(debouncedTimeout.current);

    debouncedTimeout.current = setTimeout(() => {
      setUserHasFeedback(true);

      changeTitleApiCall.mutate({ projectId: projectId, title: _message });
      setTimeout(() => {
        setUserHasFeedback(false);
      }, 200);
    }, 1000);
  }

  return { debouncedSetTitleApiCall };
}
