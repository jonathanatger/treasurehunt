import { api } from "~/trpc/client";
import { useRef, MutableRefObject } from "react";

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
    onSettled: () => {
      apiUtils.projects.fetchUserProjects.invalidate();
      apiUtils.projects.fetchUserProjects.refetch();
    },
  });

  const debouncedTimeout: MutableRefObject<
    string | number | NodeJS.Timeout | undefined
  > = useRef(0);

  function debouncedSetTitleApiCall(_message: string) {
    clearTimeout(debouncedTimeout.current);

    debouncedTimeout.current = setTimeout(() => {
      changeTitleApiCall.mutate({ projectId: projectId, title: _message });
    }, 1000);
  }

  return { debouncedSetTitleApiCall };
}
