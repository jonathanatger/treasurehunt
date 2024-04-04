import Link from "next/link";
import Image from "next/image";
import heroImage from "../../public/heroimage.png";

export default function HomePage() {
  return (
    <section className="container flex h-[200vh] flex-col items-center justify-between pt-12">
      <div className="flex flex-row items-center">
        <div className="flex flex-col">
          <h2 className="font-title text-balance pb-8 text-5xl font-bold">
            Trouver ensemble, en toute simplicité
          </h2>
          <h3 className="text-balance text-3xl">
            Organisez une chasse au trésor sans vous prendre la tête
          </h3>
        </div>
        <Image
          src={heroImage}
          width={800}
          height={800}
          alt="image of friends having fun"
          priority
        />
      </div>
    </section>
  );
}
