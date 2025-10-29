import { getContent } from "@/lib/content";

const BioSection = () => {
  const content = getContent();
  
  return (
    <section className="w-full px-4 sm:px-8 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">{content.bio.title}</h2>
      <div className="max-w-2xl space-y-4 text-sm sm:text-base leading-relaxed">
        {content.bio.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
};

export default BioSection;
