import Image from "next/image";
import { ArrowDown, ArrowRight, Figma, Github, Mail } from "lucide-react";
import heroImage from "../../public/heroimage.png";
import mapSmallImage from "../../public/mapsmallimage.png";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardHeader } from "~/components/ui/card";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="flex w-full flex-col items-center justify-between pb-24 md:h-[85vh] md:pb-0 ">
        <div className="flex w-full flex-row items-center">
          <div className="flex flex-col rounded-xl bg-primary px-8 py-6 text-primary-foreground md:py-12">
            <h2 className="text-balance pb-8 font-title text-3xl font-bold leading-snug md:text-6xl">
              BOUGER ENSEMBLE, TROUVER ENSEMBLE
            </h2>
            <h3 className="text-balance pb-8 text-2xl font-light">
              Organisez un jeu de piste sans vous prendre la tête
            </h3>
            <Link href={"/pistes"} className="w-full max-w-64">
              <Button className="w-full font-sans text-2xl shadow-lg">
                <h3 className="w-full text-left">Par ici !</h3>
                <ArrowRight />
              </Button>
            </Link>
          </div>
          <Image
            src={heroImage}
            width={800}
            height={800}
            alt="image of friends having fun"
            className="hidden pl-8 md:flex"
            priority
          />
        </div>
      </section>
      <section className="flex w-full flex-col items-center justify-center pb-24">
        <h2 className="mb-12 flex flex-row items-center rounded-lg bg-primary p-4 font-title text-lg font-bold uppercase text-primary-foreground shadow-lg md:text-2xl">
          <ArrowDown className="h-16 w-16 pr-4" /> Comment ça marche ? Et bien,
          c'est simple :
        </h2>
        <div className="flex w-full flex-col justify-between space-y-4 md:flex-row md:space-x-4 md:space-y-0 md:pb-8">
          <StepsToFollowCard />
          <StepsToFollowCard />
          <StepsToFollowCard />
        </div>
        <div className="flex items-center justify-center">
          <Link href={"/pistes"} className="w-full max-w-64">
            <Button className="px-4 text-xl font-bold shadow-lg">
              <h3 className="mr-4">Essayez-vous même</h3>
              <ArrowRight />
            </Button>
          </Link>
        </div>
      </section>
      <section className="mb-24 flex w-full flex-col items-center justify-between">
        <h2 className="mb-12 rounded-lg bg-primary p-4 font-title text-2xl text-primary-foreground shadow-lg">
          ILS L'ONT ESSAYÉ :
        </h2>
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-8 md:space-y-0">
          <TestimonialCard />
          <TestimonialCard />
          <TestimonialCard />
        </div>
      </section>

      <section className=" flex w-full justify-center  py-12">
        <div className="flex flex-col space-y-8 md:max-w-[70%] md:flex-row md:space-x-8 md:space-y-0">
          <ReasonsToBuyCard />
          <ReasonsToBuyCard />
          <ReasonsToBuyCard />
        </div>
      </section>
      <Footer />
    </>
  );
}

function StepsToFollowCard() {
  return (
    <article className="flex flex-col items-center justify-between pb-8 md:pb-0">
      <div className="flex flex-row items-center justify-center pb-4">
        <div className="flex min-h-10 min-w-10 items-center justify-center rounded-full outline outline-4 outline-primary">
          <h3 className="font-bold text-foreground">1</h3>
        </div>
        <h3 className="text-md max-w-80 text-balance px-3 font-bold text-foreground md:text-xl">
          Description de quelques lignes parce que il faut avoir du texte
        </h3>
      </div>
      <Image
        className="rounded-3xl shadow-lg"
        alt="illustration of a step to take"
        src={mapSmallImage}
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
          src={mapSmallImage}
          width={100}
          height={100}
          className="rounded-xl shadow-lg"
        />
        <h3 className="font-title text-xl">Mon nom est Bond</h3>
      </div>
      <div className="p-4">
        <h3 className="max-w-96 text-balance text-center">
          "Franchement tres cool, je recommande ! J'ai passe un super moment
          avec mes potes"
        </h3>
      </div>
    </article>
  );
}

function ReasonsToBuyCard() {
  return (
    <Card className="outline-3 flex-1 bg-background text-foreground outline outline-primary">
      <CardHeader className="font-title text-2xl underline">
        AMUSANT ET INTERACTIF
      </CardHeader>
      <CardDescription className="px-6 pb-8 text-lg">
        Nos chasses au trésor offrent une expérience ludique et interactive pour
        vous et vos amis. Vous pouvez choisir parmi une variété de thèmes et de
        défis pour rendre vos aventures encore plus excitantes.
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
        <Figma />
        <Github />
        <Mail />
      </div>
    </footer>
  );
}
