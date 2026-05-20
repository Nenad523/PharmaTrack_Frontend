import HomeFeatures from "@/app/_components/Home/features";
import HomeHero from "@/app/_components/Home/hero";
import HomeNews from "@/app/_components/Home/news";
import HomePromoVideo from "@/app/_components/Home/promo_video";
import HomeQuickActions from "@/app/_components/Home/quick_actions";

//imports
export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="order-1">
        <HomeHero />
      </div>
      <div className="order-2 md:order-4">
        <HomePromoVideo />
      </div>
      <div className="order-3 md:order-2">
        <HomeQuickActions />
      </div>
      <div className="order-4 md:order-3">
        <HomeFeatures />
      </div>
      <div className="order-5">
        <HomeNews />
      </div>
    </div>
  );
}
