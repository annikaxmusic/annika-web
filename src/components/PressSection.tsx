import { useContent } from "@/context/ContentContext";

const PressSection = () => {
  const { content } = useContent();
  
  return (
    <section className="w-full px-4 sm:px-8 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">FOR PRESS</h2>
      {content.links.press ? (
        <a 
          href={content.links.press}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full max-w-md bg-primary text-primary-foreground py-4 px-8 text-lg font-bold hover:opacity-90 transition-opacity text-center"
        >
          {content.buttonTexts.press || "Press Kit"}
        </a>
      ) : (
        <p className="text-sm text-muted-foreground">
          Add your press kit link in the admin to enable this button.
        </p>
      )}
    </section>
  );
};

export default PressSection;
