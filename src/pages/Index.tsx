import Header from "@/components/Header";
import MusicSection from "@/components/MusicSection";
import ConcertsSection from "@/components/ConcertsSection";
import VideoSection from "@/components/VideoSection";
import TipSection from "@/components/TipSection";
import BioSection from "@/components/BioSection";
import PressSection from "@/components/PressSection";
import LinksSection from "@/components/LinksSection";
import ScrollSparkles from "@/components/ScrollSparkles";
import bandPhoto from "@/assets/band-photo.png";
import { useContent } from "@/context/ContentContext";

const Index = () => {
  const { content } = useContent();
  const footerImageSrc = content.assets.footerImage || bandPhoto;
  const footerImageAlt = content.assets.footerImageAlt || "ANNIKA band";

  return (
    <div className="relative min-h-screen bg-background">
      <ScrollSparkles />
      <Header />

      <main className="max-w-4xl mx-auto">
        <MusicSection />
        <ConcertsSection />
        <VideoSection />
        <TipSection />
        <BioSection />
        <PressSection />
        <LinksSection />
      </main>

      <footer className="w-full mt-16">
        <img src={footerImageSrc} alt={footerImageAlt} className="w-full h-auto object-cover" />
      </footer>
    </div>
  );
};

export default Index;
