import Image from "next/image";
import { ArrowDown, ArrowRight, Figma, Github, Mail } from "lucide-react";
import heroImage from "../../public/heroimage.png";
import objectiveDrawing from "../../public/drawing2.png";
import clueDrawing from "../../public/drawing3.png";
import raceStartDrawing from "../../public/drawing4.png";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardHeader } from "~/components/ui/card";
import Link from "next/link";
import { auth } from "~/auth/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <>
      <section className="flex w-full flex-col items-center justify-between px-4 pb-24 pt-12 lg:h-[80vh] lg:px-0 lg:pb-0 lg:pt-0 ">
        <div className="flex w-full flex-col items-center justify-end lg:flex-row">
          <div className="flex flex-col items-center rounded-3xl bg-primary px-8 py-6 text-primary-foreground lg:absolute lg:w-[100vw] lg:-translate-x-[50vw] lg:items-end lg:py-24">
            <h2 className="text-balance font-title text-4xl font-bold leading-snug lg:pb-4 lg:text-6xl">
              BOUGER ENSEMBLE,
            </h2>
            <h2 className="text-balance pb-8 font-title text-4xl font-bold leading-snug lg:text-6xl">
              TROUVER ENSEMBLE
            </h2>
            <h3 className="text-balance pb-8 text-lg font-light lg:text-2xl">
              Organisez votre jeu de piste sans vous prendre la tête
            </h3>
            <Link
              href={session ? "/tracks" : "/login"}
              className="w-full max-w-64"
            >
              <Button className="w-full font-sans text-2xl shadow-lg hover:bg-secondary/90">
                <h3 className="w-full text-left">Par ici !</h3>
                <ArrowRight />
              </Button>
            </Link>
          </div>
          <Image
            src={heroImage}
            width={700}
            height={700}
            alt="image of friends having fun"
            className="pl-8 lg:flex"
            priority
          />
        </div>
      </section>
      <section className="flex w-full flex-col items-center justify-center pb-32">
        <h2 className="mb-12 flex flex-row items-center rounded-lg bg-primary p-4 font-title text-lg font-bold uppercase text-primary-foreground shadow-lg md:text-2xl">
          <ArrowDown className="h-16 w-16 pr-4" /> Comment ça marche ? Et bien,
          c'est simple :
        </h2>
        <div className="flex w-full flex-col justify-around space-y-4 md:flex-row md:space-x-4 md:space-y-0 md:pb-8">
          <StepsToFollowCard text="Placer ses objectifs" index={1} />
          <StepsToFollowCard
            text="Choisir des indices pour les participants"
            index={2}
          />
          <StepsToFollowCard
            text="Lancer la course et suivre l'avancement"
            index={3}
          />
        </div>
        <div className="flex w-full items-center justify-center ">
          <Link href={"/tracks"} className="flex w-full justify-center">
            <Button className="h-16 rounded-full p-4 font-title text-3xl font-bold shadow-lg">
              <h3 className="mr-4 p-4">Essayez-vous même</h3>
              <ArrowRight strokeWidth={3} size={32} />
            </Button>
          </Link>
        </div>
      </section>
      {/* <section className="mb-24 flex w-full flex-col items-center justify-between">
        <h2 className="mb-12 rounded-lg bg-primary p-4 font-title text-2xl text-primary-foreground shadow-lg">
          ILS L'ONT ESSAYÉ :
        </h2>
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-8 md:space-y-0">
          <TestimonialCard />
          <TestimonialCard />
          <TestimonialCard />
        </div>
      </section> */}

      <section className=" flex w-full justify-center  py-12">
        <div className="flex flex-col space-y-8 md:max-w-[70%] md:flex-row md:space-x-8 md:space-y-0">
          <ReasonsToBuyCard
            title="Amusant et interactif"
            content="Nos chasses au trésor offrent une expérience ludique et interactive pour vous et vos amis. Vous pouvez choisir parmi une variété de thèmes et de défis pour rendre vos aventures encore plus excitantes."
          />
          <ReasonsToBuyCard
            title="Facile d'utilisation"
            content="Notre site simplifie la création et la gestion de chasses au trésor entre amis. Vous pouvez facilement créer des énigmes, définir des indices et suivre la progression de vos amis en temps réel."
          />
          <ReasonsToBuyCard
            title="Mémorable pour vos proches"
            content="Grâce à nos chasses au trésor, vous pouvez partager des moments inoubliables avec vos proches. Explorez de nouveaux endroits, résolvez des énigmes ensemble et créez des souvenirs durables."
          />
        </div>
      </section>
      <Footer />
    </>
  );
}

function StepsToFollowCard({ text, index }: { text: string; index: number }) {
  const image = [objectiveDrawing, clueDrawing, raceStartDrawing][index - 1];
  return (
    <article className="flex flex-col items-center justify-center pb-8 md:pb-0">
      <div className="flex w-full flex-row items-center justify-center pb-4 ">
        <div className="flex min-h-10 min-w-10 items-center justify-center rounded-full outline outline-4 outline-primary">
          <h3 className="text-foreground">{index.toString()}</h3>
        </div>
        <h3 className="text-md max-w-56 text-balance px-3  text-foreground  md:text-xl">
          {text}
        </h3>
      </div>
      <Image
        className="rounded-3xl shadow-lg"
        alt="illustration of a step to take"
        src={image ?? objectiveDrawing}
        width="400"
        height="300"
      />
    </article>
  );
}

function TestimonialCard() {
  return (
    <article className="flex flex-row items-center justify-between rounded-xl bg-primary p-4 text-primary-foreground shadow-lg">
      <div className="flex flex-col items-start justify-center space-y-4 ">
        <Image
          alt="portrait image"
          src={clueDrawing}
          width={100}
          height={100}
          className="rounded-xl shadow-lg"
        />
        <h3 className="font-title text-xl">Nom prénom</h3>
      </div>
      <div className="p-4">
        <h3 className="max-w-96 text-balance text-center">Je recommande !</h3>
      </div>
    </article>
  );
}

function ReasonsToBuyCard({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <Card className="outline-3 flex-1 bg-background text-foreground outline outline-primary">
      <CardHeader className=" font-title text-2xl uppercase underline">
        {title}
      </CardHeader>
      <CardDescription className="px-6 pb-8 text-lg text-foreground">
        {content}
      </CardDescription>
    </Card>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col justify-between space-y-2 border-t-2 border-primary pt-2 font-title text-muted md:flex-row md:space-y-0">
      <div>TREASURIO</div>
      <div className="flex flex-col justify-start">
        <div>3 rue Poirier de Narcay</div>
        <div>75014 Paris</div>
      </div>
      <div className="flex flex-col">
        <div>CODE + DESIGN</div>
        <div>Jonathan ATGER</div>
      </div>
      <div className="flex flex-row space-x-1">
        <Link
          href="https://www.figma.com/file/nnIsqT543sQI7iUPESDUrF/Treasurio?type=design&node-id=3920%3A260&mode=design&t=MIGsZDwwdYBtO6FS-1"
          target="_blank"
        >
          <Figma />
        </Link>
        <Link
          href="https://github.com/jonathanatger/treasurehunt"
          target="_blank"
        >
          <Github />
        </Link>
        <Link href="mailto:jonathan.atger@gmail.com">
          <Mail />
        </Link>
      </div>
    </footer>
  );
}
