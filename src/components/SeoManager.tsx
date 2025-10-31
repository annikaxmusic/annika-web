import { Helmet } from "react-helmet-async";
import { useContent } from "@/context/ContentContext";

const defaultCanonical = "https://annika-web.vercel.app/";
const defaultOgAlt = "ANNIKA standing in front of a blue smiley mural";

const normalizeTwitterHandle = (handle?: string) => {
  if (!handle) {
    return undefined;
  }

  return handle.startsWith("@") ? handle : `@${handle}`;
};

const SeoManager = () => {
  const {
    content: { seo, assets },
  } = useContent();

  const title = seo.title?.trim() || "ANNIKA";
  const description = seo.description?.trim() ||
    "ANNIKA is a Latvian alternative indie-rock artist blending poetic fragility with raw energy.";
  const keywords = seo.keywords?.trim();
  const author = seo.author?.trim();
  const canonicalUrl = seo.canonicalUrl?.trim() || defaultCanonical;
  const twitterHandle = normalizeTwitterHandle(seo.twitterHandle?.trim());

  const ogImage = assets.ogImage?.trim() || "/og-image.png";
  const favicon = assets.favicon?.trim() || "/favicon.png";
  const appleTouchIcon = assets.appleTouchIcon?.trim() || "/apple-touch-icon.png";
  const ogAlt = assets.footerImageAlt?.trim() || defaultOgAlt;

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#030712" />
      <meta name="color-scheme" content="dark light" />

      <link rel="canonical" href={canonicalUrl} />
      <link rel="icon" href={favicon} />
      <link rel="apple-touch-icon" href={appleTouchIcon} />
      <link rel="manifest" href="/site.webmanifest" />

      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="ANNIKA" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogAlt} />
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
    </Helmet>
  );
};

export default SeoManager;

