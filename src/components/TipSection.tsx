import { useContent } from "@/context/ContentContext";

const TipSection = () => {
  const { content } = useContent();
  
  return (
    <section className="w-full px-4 sm:px-8 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Tip meee</h2>
      {content.links.tip ? (
        <>
          <a 
            href={content.links.tip}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full max-w-md bg-primary text-primary-foreground py-4 px-8 text-lg font-bold text-center shadow-[0_16px_35px_-20px_rgba(59,130,246,0.7)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_32px_55px_-22px_rgba(59,130,246,0.7)] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/70"
          >
            {content.buttonTexts.tip || "Send a tip"}
          </a>
          {content.assets.tipImage && (
            <div className="mt-6 max-w-md">
              <img
                src={content.assets.tipImage}
                alt="Tip"
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          Add your tip link in the admin to show a button here.
        </p>
      )}
    </section>
  );
};

export default TipSection;
