import { api } from "~/trpc/server";

export default async function Page() {
  return (
    <>
      <main className="top-12 flex h-[100svh] w-[100%] justify-center overflow-auto">
        <section className="box-border h-[calc(100%-3rem)] max-w-2xl text-foreground">
          <h1 className="pb-8 text-3xl font-bold">Privacy Policy</h1>
          <p className="pb-4 text-lg">
            This Privacy Policy explains how your personal information is
            collected and used when you visit the Treasure Hunt website or use
            the app.
          </p>
          <p className="text-md">
            Treasure Hunt is committed to protecting your privacy. This Privacy
            Policy explains how your personal information is collected and used
            when you visit the Treasure Hunt website.
          </p>
        </section>
      </main>
    </>
  );
}
