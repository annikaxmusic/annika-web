import { useContent } from "@/context/ContentContext";

const MusicSection = () => {
  const { content } = useContent();
  const baseSpotifyUrl = content.links.spotify || "";
  const spotifyEmbedUrl = baseSpotifyUrl
    ? `${baseSpotifyUrl.replace("open.spotify.com/artist/", "open.spotify.com/embed/artist/")}?utm_source=generator&theme=0`
    : "";
  
  return (
    <section className="w-full px-4 sm:px-8 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Music</h2>
      <div className="max-w-2xl space-y-4">
        {spotifyEmbedUrl ? (
          <iframe 
            style={{ borderRadius: "12px" }}
            src={spotifyEmbedUrl}
            width="100%" 
            height="352" 
            frameBorder="0" 
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Add a Spotify artist link in the admin to show the embed player.
          </p>
        )}
      </div>
    </section>
  );
};

export default MusicSection;
