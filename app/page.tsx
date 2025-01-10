import HeroSection from "./_contentBlocks/HeroSection";
import Newsletter from "./_contentBlocks/Newsletter";
import ProductListing from "./_contentBlocks/ProductListing";
import QualityAssuarance from "./_contentBlocks/QualityAssuarance";

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
