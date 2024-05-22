import NavLink from "~/components/ui/NavLink";
import { ProjectTrackingClientComponents } from "./clientComponents";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="flex h-full w-full flex-col space-y-4 md:space-y-6">
        <section
          className="flex w-full flex-col justify-between space-y-2 rounded-3xl p-2 outline outline-1 
        outline-secondary md:h-[80px] md:flex-row md:items-end md:space-x-8 md:space-y-0"
        >
          <ProjectTrackingClientComponents />
        </section>
        <section className="flex h-full w-full flex-col items-center justify-start space-y-8 overflow-clip rounded-3xl p-4 shadow-lg outline outline-1 outline-primary">
          {children}
        </section>
      </main>
    </>
  );
}
