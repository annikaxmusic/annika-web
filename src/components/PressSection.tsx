import { getContent } from "@/lib/content";

const PressSection = () => {
  const content = getContent();
  
  return (
    <section className="w-full px-4 sm:px-8 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">FOR PRESS</h2>
      <a 
        href={content.links.press}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full max-w-md bg-primary text-primary-foreground py-4 px-8 text-lg font-bold hover:opacity-90 transition-opacity text-center"
      >
        {content.buttonTexts.press}
      </a>
    </section>
  );
};

export default PressSection;
