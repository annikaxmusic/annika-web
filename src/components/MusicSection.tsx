import { getContent } from "@/lib/content";

const MusicSection = () => {
  const content = getContent();
  const spotifyEmbedUrl = content.links.spotify.replace('open.spotify.com/artist/', 'open.spotify.com/embed/artist/') + '?utm_source=generator&theme=0';
  
  return (
    <section className="w-full px-4 sm:px-8 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Music</h2>
      <div className="max-w-2xl space-y-4">
        <iframe 
          style={{ borderRadius: '12px' }}
          src={spotifyEmbedUrl}
          width="100%" 
          height="352" 
          frameBorder="0" 
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default MusicSection;
