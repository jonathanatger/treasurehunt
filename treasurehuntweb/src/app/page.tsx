import Image from "next/image";
import { ArrowRight, Figma, Github, Mail } from "lucide-react";
import heroImage from "../../public/heroimage.png";
import mapSmallImage from "../../public/mapsmallimage.png";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardHeader } from "~/components/ui/card";

export default function HomePage() {
  return (
    <>
      <section className="flex h-[85vh] w-full flex-col items-center justify-between ">
        <div className="flex w-full flex-row items-center">
          <div className="flex flex-col rounded-xl bg-primary px-8 py-12 text-primary-foreground">
            <h2 className="text-balance pb-8 font-title text-6xl font-bold leading-snug">
              BOUGER ENSEMBLE, TROUVER ENSEMBLE
            </h2>
            <h3 className="text-balance pb-8 text-2xl font-light">
              Organisez un jeu de piste sans vous prendre la tête
            </h3>
            <Button className="max-w-64 font-sans text-2xl shadow-lg">
              <h3 className="w-full text-left">Par ici !</h3>
            </Button>
          </div>
          <Image
            src={heroImage}
            width={800}
            height={800}
            alt="image of friends having fun"
            className="pl-8"
            priority
          />
        </div>
      </section>
      <section className="flex w-full flex-col items-center justify-center pb-24">
        <h2 className="mb-12 flex flex-row items-center rounded-lg bg-primary p-4 font-title text-2xl font-bold uppercase text-primary-foreground shadow-lg">
          <ArrowRight className="h-16 w-16 pr-4" /> Comment ça marche ? Et bien,
          c'est simple :
        </h2>
        <div className="flex w-full flex-row justify-between space-x-4">
          <StepsToFollowCard />
          <StepsToFollowCard />
          <StepsToFollowCard />
        </div>
        <div className="flex items-center justify-center pt-8">
          <Button className="px-4 text-xl font-bold shadow-lg">
            Essayez vous-même
          </Button>
        </div>
      </section>
      <section className="mb-24 flex w-full flex-col items-center justify-between">
        <h2 className="mb-12 rounded-lg bg-primary p-4 font-title text-2xl text-primary-foreground shadow-lg">
          ILS L'ONT ESSAYÉ :
        </h2>
        <div className="flex flex-row space-x-8">
          <TestimonialCard />
          <TestimonialCard />
        </div>
      </section>

      <section className=" flex w-full justify-center  py-12">
        <div className="flex max-w-[70%] flex-row space-x-8">
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
    <article className="flex flex-col items-center justify-between">
      <div className="flex flex-row items-center justify-center pb-4">
        <div className="flex min-h-10 min-w-10 items-center justify-center rounded-full outline outline-4 outline-primary">
          <h3 className="font-bold text-foreground">1</h3>
        </div>
        <h3 className="max-w-80 text-balance px-3 text-xl font-bold text-foreground">
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
    <footer className="flex flex-row justify-between border-t-2 border-primary pt-2 font-title text-muted">
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
