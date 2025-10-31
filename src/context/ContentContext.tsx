import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import contentData from "@/data/content.json";

type SiteContent = typeof contentData;

type ContentContextValue = {
  content: SiteContent;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
  resetContent: () => void;
};

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

const cloneContent = (): SiteContent => JSON.parse(JSON.stringify(contentData));

const mergeContent = (base: SiteContent, maybeOverride: unknown): SiteContent => {
  if (!maybeOverride || typeof maybeOverride !== "object") {
    return base;
  }

  const override = maybeOverride as Partial<SiteContent>;

  return {
    ...base,
    ...override,
    bio: {
      ...base.bio,
      ...override.bio,
      paragraphs: Array.isArray(override.bio?.paragraphs)
        ? override.bio.paragraphs
        : base.bio.paragraphs,
    },
    concerts: Array.isArray(override.concerts) ? override.concerts : base.concerts,
    links: {
      ...base.links,
      ...override.links,
    },
    buttonTexts: {
      ...base.buttonTexts,
      ...override.buttonTexts,
    },
    seo: {
      ...base.seo,
      ...override.seo,
    },
    assets: {
      ...base.assets,
      ...override.assets,
    },
  };
};

const getInitialContent = (): SiteContent => {
  const defaults = cloneContent();

  if (typeof window === "undefined") {
    return defaults;
  }

  const savedContent = window.localStorage.getItem("siteContent");

  if (!savedContent) {
    return defaults;
  }

  try {
    const parsed = JSON.parse(savedContent);
    return mergeContent(defaults, parsed);
  } catch (error) {
    console.error("Failed to parse saved content", error);
    return defaults;
  }
};

type ContentProviderProps = {
  children: React.ReactNode;
};

export const ContentProvider = ({ children }: ContentProviderProps) => {
  const [content, setContent] = useState<SiteContent>(() => getInitialContent());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem("siteContent", JSON.stringify(content));
  }, [content]);

  const resetContent = useCallback(() => {
    const defaults = cloneContent();
    setContent(defaults);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem("siteContent");
    }
  }, [setContent]);

  const value = useMemo<ContentContextValue>(() => ({
    content,
    setContent,
    resetContent,
  }), [content, resetContent]);

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);

  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }

  return context;
};

