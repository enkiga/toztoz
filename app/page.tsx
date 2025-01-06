import HeroSection from "./_contentBlocks/HeroSection";
import Newsletter from "./_contentBlocks/Newsletter";
import ProductListing from "./_contentBlocks/ProductListing";
import QualityAssuarance from "./_contentBlocks/QualityAssuarance";

export default function Home() {
  return (
    <div className="py-20">
      <HeroSection />
      <QualityAssuarance />
      <ProductListing />
      <Newsletter />
    </div>
  );
}
