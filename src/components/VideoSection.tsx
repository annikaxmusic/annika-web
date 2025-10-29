import { getContent } from "@/lib/content";

const VideoSection = () => {
  const content = getContent();
  
  return (
    <section className="w-full px-4 sm:px-8 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Video</h2>
      <div className="max-w-2xl">
        <div className="relative rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
          <iframe 
            className="absolute inset-0 w-full h-full"
            src={content.links.youtube}
            title="ANNIKA - Video"
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
