import Link from "next/link";
import NavLink from "~/components/ui/NavLink";
import { launchGame } from "~/lib/serverActions";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="flex h-full w-full flex-col space-y-8">
        <section className="flex h-[60px] w-full flex-row items-end space-x-8">
          <div className="flex h-8 grow flex-row items-center justify-around rounded-full shadow-lg outline outline-1 outline-primary">
            <NavSubLink route="classement" title="Classement" />
            <NavSubLink route="carte" title="Carte" />
          </div>
          <form
            action={launchGame}
            className="flex h-full w-96 max-w-96 justify-center rounded-full bg-secondary text-secondary-foreground shadow-lg active:outline active:outline-2 active:outline-secondary"
          >
            <button type="submit">Lancer la partie !</button>
          </form>
        </section>
        <section className="flex h-full w-full flex-col items-center justify-start space-y-8 overflow-clip rounded-3xl p-4 shadow-lg outline outline-1 outline-foreground">
          {children}
        </section>
      </main>
    </>
  );
}

const NavSubLink = function (props: {
  title: string;
  route: string;
}): React.ReactNode {
  return (
    <NavLink
      href={`${props.route}`}
      activeClassName="bg-primary text-primary-foreground"
      nonActiveClassName="hover:bg-indigo-100"
      className="text-md flex h-full w-full items-center justify-center rounded-full px-12 font-bold text-primary"
    >
      {props.title}
    </NavLink>
  );
};
