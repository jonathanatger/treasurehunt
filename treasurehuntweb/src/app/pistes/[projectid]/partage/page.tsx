import { Card } from "~/components/ui/card";
import heroImage from "../../../../../public/heroimage.png";
import Image from "next/image";
import { TitleChange, LinkToClipboardCard } from "./clientComponents";
import { api } from "~/trpc/server";

export default async function Page({
  params,
}: {
  params: { projectid: string };
}) {
  const _projectId = Number(params.projectid);

  return (
    <>
      <main className="h-full w-full">
        <section className="flex h-full w-full flex-row overflow-clip rounded-3xl shadow-lg outline outline-1 outline-primary">
          <div className="flex h-full flex-1 flex-col  items-center justify-center">
            <div className="container flex flex-col space-y-4">
              <Card className="flex flex-row items-center justify-around rounded-full bg-primary p-2 font-title">
                <label className="px-2">Nom de la piste </label>
                <TitleChange projectId={_projectId} />
              </Card>

              <div className="container  rounded-3xl p-4 text-muted outline outline-2 outline-muted">
                Les participants peuvent rejoindre la course en téléchargeant
                l’application et en suivant le lien ci-dessous.
              </div>
              <LinkToClipboardCard projectId={params.projectid} />
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <Image src={heroImage} alt="image of friends"></Image>
          </div>
        </section>
      </main>
    </>
  );
}
