import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/pistes(.*)"]);

export default clerkMiddleware(
  async (auth, request) => {
    if (isProtectedRoute(request) === false) return;

    const authObj = auth();
    const userId = authObj.userId;
    let isAuthorized = false;

    if (userId === null) {
      authObj.redirectToSignIn();
      return;
    }

    const userMetadataProjectIds = (await clerkClient.users.getUser(userId))
      .publicMetadata.projectIds as string[] | undefined;
    const url = request.nextUrl;

    if (!userMetadataProjectIds) {
      authObj.redirectToSignIn();
      return;
    }

    userMetadataProjectIds.forEach((projectId) => {
      if (
        url.pathname.includes(`pistes/${projectId}`) ||
        url.pathname.endsWith("pistes")
      ) {
        isAuthorized = true;
      }
    });

    if (isAuthorized === false) authObj.redirectToSignIn();
  },
  { debug: false },
);

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
