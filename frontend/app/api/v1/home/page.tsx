import HomeFeatures from "@/app/_components/Home/features";
import HomeHero from "@/app/_components/Home/hero";
import HomeNews from "@/app/_components/Home/news";
import HomeQuickActions from "@/app/_components/Home/quick_actions";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[30rem] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_65%)]" />
      <div className="absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl" />

      <HomeHero />
      <HomeQuickActions />
      <HomeFeatures />
      <HomeNews />
    </div>
  );
}
