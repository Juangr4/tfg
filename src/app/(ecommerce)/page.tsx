import { AboutSection, AdvantagesSection, MainSection } from "./home-sections";

export default function Home() {
  return (
    <main className="w-full">
      <MainSection />
      <AboutSection />
      <AdvantagesSection />
    </main>
  );
}
