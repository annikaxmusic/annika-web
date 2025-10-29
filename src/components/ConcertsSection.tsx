import { getContent } from "@/lib/content";

const ConcertsSection = () => {
  const content = getContent();
  
  return (
    <section className="w-full px-4 sm:px-8 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Concerts</h2>
      <div className="max-w-md">
        {content.concerts.map((concert, index) => {
          const content = (
            <>
              <span>{concert.event}</span>
              <span>{concert.date}</span>
            </>
          );
          
          return concert.url ? (
            <a
              key={index}
              href={concert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-between py-2 border-b border-foreground hover:opacity-70 transition-opacity"
            >
              {content}
            </a>
          ) : (
            <div 
              key={index}
              className="flex justify-between py-2 border-b border-foreground"
            >
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ConcertsSection;
