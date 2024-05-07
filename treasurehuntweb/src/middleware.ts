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

    const userMetadata = (await clerkClient.users.getUser(userId))
      .publicMetadata.projectIds as string[] | undefined;
    const url = request.nextUrl;

    if (!userMetadata) {
      authObj.redirectToSignIn();
      return;
    }

    userMetadata.forEach((element) => {
      if (
        url.pathname.includes(`pistes/${element}`) ||
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
