import HomeFeatures from "@/app/_components/Home/features";
import HomeHero from "@/app/_components/Home/hero";
import HomeNews from "@/app/_components/Home/news";
import HomePromoVideo from "@/app/_components/Home/promo_video";
import HomeQuickActions from "@/app/_components/Home/quick_actions";

//imports
export default function Home() {
  return (
    <div>
      <HomeHero />
      <HomeQuickActions />
      <HomeFeatures />
      <HomePromoVideo />
      <HomeNews />
    </div>
  );
}
