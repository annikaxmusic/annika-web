import { getContent } from "@/lib/content";

const TipSection = () => {
  const content = getContent();
  
  return (
    <section className="w-full px-4 sm:px-8 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Tip meee</h2>
      <a 
        href={content.links.tip}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full max-w-md bg-primary text-primary-foreground py-4 px-8 text-lg font-bold hover:opacity-90 transition-opacity text-center"
      >
        {content.buttonTexts.tip}
      </a>
    </section>
  );
};

export default TipSection;
