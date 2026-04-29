import HomeFeatures from "@/app/_components/Home/features";
import HomeHero from "@/app/_components/Home/hero";
import HomeNews from "@/app/_components/Home/news";
import HomeQuickActions from "@/app/_components/Home/quick_actions";

//imports
export default function Home() {
  return (
    <div>
      <HomeHero />
      <HomeQuickActions />
      <HomeFeatures />
      <HomeNews />
    </div>
  );
}
