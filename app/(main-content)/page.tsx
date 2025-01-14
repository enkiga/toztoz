import HeroSection from "@/app/_contentBlocks/HeroSection";
import Newsletter from "@/app/_contentBlocks/Newsletter";
import ProductListing from "@/app/_contentBlocks/ProductListing";
import QualityAssuarance from "@/app/_contentBlocks/QualityAssuarance";

export default function Home() {
  return (
    <div className="pt-20">
      <HeroSection />
      <QualityAssuarance />
      <ProductListing title="Top Products" count={8} />
      <Newsletter />
    </div>
  );
}
