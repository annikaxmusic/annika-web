import { useContent } from "@/context/ContentContext";

const VideoSection = () => {
  const { content } = useContent();
  
  return (
    <section className="w-full px-4 sm:px-8 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Video</h2>
      <div className="max-w-2xl">
        {content.links.youtube ? (
          <div className="relative rounded-lg overflow-hidden" style={{ paddingBottom: "56.25%" }}>
            <iframe 
              className="absolute inset-0 w-full h-full"
              src={content.links.youtube}
              title="ANNIKA - Video"
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Add a YouTube embed URL in the admin to feature a video here.
          </p>
        )}
      </div>
    </section>
  );
};

export default VideoSection;
