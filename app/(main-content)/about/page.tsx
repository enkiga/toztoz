import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import QualityAssuarance from "@/app/_contentBlocks/QualityAssuarance";
import Newsletter from "@/app/_contentBlocks/Newsletter";

type Props = {};

const AboutUs = (props: Props) => {
  return (
    <section className="w-full md:min-h-screen pt-20">
      {/* Title */}
      <h1 className="md:text-center text-3xl font-base text-wrap px-10 md:px-0 md:w-1/2 mx-auto">
        A brand built on the love of comfort, quality, and outsanding customer
        service
      </h1>
      {/* Section 1 */}
      <div className="w-full flex flex-wrap mt-6">
        <div className="md:w-1/2 w-full flex flex-col px-10">
          <h1 className="font-semibold text-xl mb-4">
            From studio in London to a global brand with over 400 outlets
          </h1>
          <p className="mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde odit
            ab eius et delectus aut repellat illum deserunt sapiente! Assumenda
            sed alias libero omnis maxime debitis voluptates nostrum unde et.
          </p>
          <p className="mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
            placeat et, at ex voluptas inventore, pariatur maxime molestiae
            asperiores molestias voluptate cum adipisci fugiat quis optio beatae
            dolor ab in?
          </p>
          <Button size="lg" className="md:w-fit mb-4">
            Get in touch
          </Button>
        </div>
        <Image
          src="https://images.unsplash.com/photo-1655392032265-fdf00640d2ad?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="About us image"
          width={1000}
          height={1000}
          priority
          className="md:w-1/2 w-full object-contain object-center"
        />
      </div>
      {/* Section 2 */}
      <div className="w-full flex flex-wrap mb-6 bg-gray-50">
        <Image
          src="https://images.unsplash.com/photo-1654064756771-383a36482ca5?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="About us image"
          width={1000}
          height={1000}
          className="md:w-1/2 w-full object-contain object-center"
        />
        <div className="md:w-1/2 w-full flex flex-col px-10">
          <h1 className="font-semibold text-xl my-4">
            From studio in London to a global brand with over 400 outlets
          </h1>
          <p className="mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde odit
            ab eius et delectus aut repellat illum deserunt sapiente! Assumenda
            sed alias libero omnis maxime debitis voluptates nostrum unde et.
          </p>
          <p className="mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
            placeat et, at ex voluptas inventore, pariatur maxime molestiae
            asperiores molestias voluptate cum adipisci fugiat quis optio beatae
            dolor ab in?
          </p>
          <Button size="lg" className="md:w-fit mb-4">
            Get in touch
          </Button>
        </div>
      </div>
      {/* Quality assuarance */}
      <QualityAssuarance />
      {/* Newsletter */}
      <Newsletter />
    </section>
  );
};

export default AboutUs;
