import { LandingNav } from "@/components/landing/nav";
import { HeroDossier } from "@/components/landing/hero-dossier";
import { HeroRunner } from "@/components/landing/hero-runner";
import { CoursesStrip } from "@/components/landing/courses-strip";
import { HowItWorks } from "@/components/landing/how-it-works";
import { StatsSql } from "@/components/landing/stats-sql";
import { LanguagesStrip } from "@/components/landing/languages-strip";
import { FinalCta } from "@/components/landing/final-cta";
import { LandingFooter } from "@/components/landing/footer";

function GridBg() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
  );
}

export default function LandingPage() {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden font-sans antialiased selection:bg-[#10B981] selection:text-black"
      style={{ background: "#0A0A0B", color: "#fff" }}
    >
      <GridBg />

      <LandingNav />

      <section className="relative z-10 px-6 pt-12 md:px-10 md:pt-16">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 lg:gap-10">
          <HeroDossier />
          <HeroRunner />
        </div>
      </section>

      <CoursesStrip />
      <HowItWorks />
      <StatsSql />
      <LanguagesStrip />
      <FinalCta />
      <LandingFooter />
    </div>
  );
}
