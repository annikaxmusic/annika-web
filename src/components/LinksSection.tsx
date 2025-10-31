import { useContent } from "@/context/ContentContext";

const LinksSection = () => {
  const { content } = useContent();
  const links = [
    { label: "INSTAGRAM @ANNIKAXMUSIC", url: content.links.instagram },
    { label: "SPOTIFY @ANNIKA", url: content.links.spotify },
    { label: "YOUTUBE @ANNIKA", url: content.links.youtubeChannel },
    { label: "EMAIL: ausmane.annika@gmail.com", url: content.links.email },
  ].filter((link): link is { label: string; url: string } => Boolean(link.url));

  return (
    <section className="w-full px-4 sm:px-8 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">SUPER OFFICIAL LINKS</h2>
      <div className="max-w-md space-y-2">
        {links.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Add your socials and email in the admin to list them here.
          </p>
        )}

        {links.map((link, index) => (
          <div key={index} className="border-b border-foreground py-2">
            <a 
              href={link.url}
              className="hover:opacity-70 transition-opacity"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LinksSection;
