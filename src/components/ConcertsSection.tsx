import { useContent } from "@/context/ContentContext";

const ConcertsSection = () => {
  const { content } = useContent();
  
  return (
    <section className="w-full px-4 sm:px-8 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Concerts</h2>
      <div className="max-w-md">
        {content.concerts.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Add upcoming shows in the admin to display them here.
          </p>
        )}

        {content.concerts.map((concert, index) => {
          const rowContent = (
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
              {rowContent}
            </a>
          ) : (
            <div 
              key={index}
              className="flex justify-between py-2 border-b border-foreground"
            >
              {rowContent}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ConcertsSection;
