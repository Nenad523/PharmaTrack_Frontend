import HomeFeatures from "@/app/_components/Home/features";
import HomeHero from "@/app/_components/Home/hero";
import HomeNews from "@/app/_components/Home/news";
import HomePromoVideo from "@/app/_components/Home/promo_video";
import HomeQuickActions from "@/app/_components/Home/quick_actions";

//imports
export default function Home() {
  return (
    <div className="flex flex-col">
      <div>
        <HomeHero />
      </div>
      <div>
        <HomeQuickActions />
      </div>
      <div>
        <HomeFeatures />
      </div>
      <div>
        <HomePromoVideo />
      </div>
      <div>
        <HomeNews />
      </div>
    </div>
  );
}
