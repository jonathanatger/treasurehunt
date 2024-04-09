export default async function Page({
  params,
}: {
  params: { projectid: string };
}) {
  return (
    <>
      <main className="h-full w-full p-4">
        <section className="flex h-full w-full flex-row overflow-clip rounded-3xl bg-slate-600 outline outline-1 outline-slate-500">
          <div className="h-full flex-1 overflow-auto"></div>
          <div className="flex-1 bg-white"></div>
        </section>
      </main>
    </>
  );
}
