import Header from "@/components/Header";
import MusicSection from "@/components/MusicSection";
import ConcertsSection from "@/components/ConcertsSection";
import VideoSection from "@/components/VideoSection";
import TipSection from "@/components/TipSection";
import BioSection from "@/components/BioSection";
import PressSection from "@/components/PressSection";
import LinksSection from "@/components/LinksSection";
import bandPhoto from "@/assets/band-photo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-2xl mx-auto">
        <MusicSection />
        <ConcertsSection />
        <VideoSection />
        <TipSection />
        <BioSection />
        <PressSection />
        <LinksSection />
      </main>

      <footer className="w-full mt-16">
        <img src={bandPhoto} alt="ANNIKA band" className="w-full h-auto object-cover" />
      </footer>
    </div>
  );
};

export default Index;
