import { CarIcon, CheckCircleIcon, Wallet2Icon } from "lucide-react";
import React from "react";

type Props = {};

const QualityAssuarance = (props: Props) => {
  return (
    <section className="w-full px-3 md:w-5/6 flex flex-col items-center justify-center mx-auto my-6">
      <h1 className="text-xl md:text-2xl font-semibold">
        {" "}
        What Makes our brand different
      </h1>
      <div className="w-full flex flex-wrap items-center mt-4">
        <QualityAssuaranceCard
          icon={<CarIcon size={24} />}
          title="Next day as standard"
          description="Order by 3pm and get your order the next day as standard"
        />
        <QualityAssuaranceCard
          icon={<CheckCircleIcon size={24} />}
          title="Quality products"
          description="A variety of high quality products trusted over the years to choose from"
        />
        <QualityAssuaranceCard
          icon={<Wallet2Icon size={24} />}
          title="Unbeatable Prices"
          description="Find the same product cheaper elsewhere and we will match it"
        />
        <QualityAssuaranceCard
          icon={<CarIcon size={24} />}
          title="Quality"
          description="We only use the best materials to create our products."
        />
      </div>
    </section>
  );
};

export default QualityAssuarance;

type QualityAssuaranceCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const QualityAssuaranceCard = ({
  icon,
  title,
  description,
}: QualityAssuaranceCardProps) => {
  return (
    <div className="flex flex-col items-start justify-center w-full md:w-1/4 px-2 py-4">
      {/* Icon */}
      {icon}
      {/* Title */}
      <h1 className="text-base font-medium mt-4">{title}</h1>
      {/* Description */}
      <p className="text-sm mt-2 line-clamp-3">{description}</p>
    </div>
  );
};
