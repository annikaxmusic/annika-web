import { useContent } from "@/context/ContentContext";

const BioSection = () => {
  const { content } = useContent();
  
  // Ensure paragraphs is always an array
  const paragraphs = Array.isArray(content.bio?.paragraphs) 
    ? content.bio.paragraphs.filter(p => p && typeof p === "string")
    : [];
  
  // Don't render section if there's no content
  if (!paragraphs.length && !content.bio?.title) {
    return null;
  }
  
  return (
    <section className="w-full px-4 sm:px-8 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">{content.bio?.title || ""}</h2>
      <div className="max-w-2xl space-y-4 text-sm sm:text-base leading-relaxed">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
};

export default BioSection;
