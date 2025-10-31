import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import contentData from "@/data/content.json";

type SiteContent = typeof contentData;

type ContentContextValue = {
  content: SiteContent;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
  resetContent: () => void;
  saveContent: (content: SiteContent) => Promise<void>;
  refreshContent: () => Promise<void>;
};

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

const cloneContent = (): SiteContent => JSON.parse(JSON.stringify(contentData));

const padNumber = (value: number, length = 2) => value.toString().padStart(length, "0");

const normalizeLegacyDate = (raw: unknown): string => {
  if (typeof raw !== "string") {
    return "";
  }

  const value = raw.trim();

  if (!value) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const legacyMatch = value.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);

  if (!legacyMatch) {
    return "";
  }

  const [, dayStr, monthStr, yearStr] = legacyMatch;
  const day = padNumber(Number.parseInt(dayStr, 10));
  const month = padNumber(Number.parseInt(monthStr, 10));
  const yearNum = Number.parseInt(yearStr, 10);

  if (Number.isNaN(yearNum)) {
    return "";
  }

  const year = yearStr.length === 2 ? `20${padNumber(yearNum, 2)}` : padNumber(yearNum, 4);

  return `${year}-${month}-${day}`;
};

const normalizeLegacyTime = (raw: unknown): string => {
  if (typeof raw !== "string") {
    return "";
  }

  const value = raw.trim();

  if (!value) {
    return "";
  }

  const match = value.match(/^(\d{1,2})(?::(\d{1,2}))?$/);

  if (!match) {
    return "";
  }

  const hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2] ?? "0", 10);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return "";
  }

  return `${padNumber(hours)}:${padNumber(minutes)}`;
};

const normalizeFromLegacyDateTime = (raw: unknown) => {
  if (typeof raw !== "string" || !raw.trim()) {
    return { date: "", time: "" };
  }

  const date = new Date(raw);

  if (Number.isNaN(date.getTime())) {
    return { date: "", time: "" };
  }

  return {
    date: `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`,
    time: `${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`,
  };
};

type ConcertShape = SiteContent["concerts"][number];

const normalizeConcert = (value: unknown, fallback: ConcertShape): ConcertShape => {
  if (!value || typeof value !== "object") {
    return fallback;
  }

  const source = value as Record<string, unknown> & { dateTime?: string };
  const event = typeof source.event === "string" ? source.event : fallback.event;
  const url = typeof source.url === "string" ? source.url : fallback.url;

  let date = typeof source.date === "string" ? normalizeLegacyDate(source.date) : "";
  let time = typeof source.time === "string" ? normalizeLegacyTime(source.time) : "";

  if ((!date || !time) && typeof source.dateTime === "string") {
    const converted = normalizeFromLegacyDateTime(source.dateTime);
    date = date || converted.date;
    time = time || converted.time;
  }

  if (!date) {
    date = fallback.date;
  }

  if (!time) {
    time = fallback.time ?? "";
  }

  return {
    event,
    url,
    date,
    time,
  };
};

const mergeConcerts = (baseConcerts: SiteContent["concerts"], overrideConcerts: unknown): SiteContent["concerts"] => {
  if (!Array.isArray(overrideConcerts)) {
    return baseConcerts;
  }

  const length = Math.max(baseConcerts.length, overrideConcerts.length);
  const result: SiteContent["concerts"] = [];

  for (let index = 0; index < length; index += 1) {
    const fallback = baseConcerts[index] ?? { event: "", date: "", time: "", url: "" };
    const override = index < overrideConcerts.length ? overrideConcerts[index] : undefined;

    if (override === undefined) {
      result.push(fallback);
      continue;
    }

    result.push(normalizeConcert(override, fallback));
  }

  return result;
};

const mergeContent = (base: SiteContent, maybeOverride: unknown): SiteContent => {
  if (!maybeOverride || typeof maybeOverride !== "object") {
    return base;
  }

  const override = maybeOverride as Partial<SiteContent>;

  return {
    ...base,
    ...override,
    bio: override.bio && typeof override.bio === "object"
      ? {
          ...base.bio,
          ...override.bio,
          // Only use override paragraphs if they exist and have content
          paragraphs: Array.isArray(override.bio.paragraphs) && override.bio.paragraphs.length > 0
            ? override.bio.paragraphs
            : base.bio.paragraphs,
          title: typeof override.bio.title === "string" && override.bio.title.trim()
            ? override.bio.title 
            : base.bio.title,
        }
      : base.bio,
    concerts: mergeConcerts(base.concerts, override.concerts),
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
  // Always use content.json as the source of truth
  return cloneContent();
};

type ContentProviderProps = {
  children: React.ReactNode;
};

export const ContentProvider = ({ children }: ContentProviderProps) => {
  const [content, setContent] = useState<SiteContent>(() => getInitialContent());

  const refreshContent = useCallback(async () => {
    try {
      const response = await fetch("/api/content");
      if (response.ok) {
        const text = await response.text();
        if (text) {
          try {
            const data = JSON.parse(text);
            console.log("API response data:", data);
            console.log("Bio in API response:", data.bio);
            const normalized = mergeContent(cloneContent(), data);
            console.log("Normalized bio:", normalized.bio);
            setContent(normalized);
            return;
          } catch (parseError) {
            console.error("Failed to parse API response:", parseError);
            // Fall through to default
          }
        }
      } else if (response.status === 404 && import.meta.env.DEV) {
        console.warn("API endpoint not found in development. Use 'vercel dev' or deploy to Vercel.");
      }
    } catch (error) {
      if (import.meta.env.DEV && error instanceof TypeError) {
        console.warn("API not available in development mode. Use 'vercel dev' for local API testing.");
      } else {
        console.error("Failed to fetch content from API, using default", error);
      }
    }
    
    // Fallback: Use default content.json
    console.warn("Using default content.json. API not available.");
  }, []);

  // Fetch content from API on mount
  useEffect(() => {
    refreshContent();
  }, [refreshContent]);

  const saveContent = useCallback(async (newContent: SiteContent) => {
    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContent),
      });

      // Get response text first (can only read once)
      const text = await response.text();
      let data;
      
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          // If status is ok but JSON is invalid, still consider it success
          if (response.ok) {
            console.warn("Invalid JSON response but status OK:", text);
            data = { success: true };
          } else {
            throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
          }
        }
      } else {
        // Empty response
        if (response.ok) {
          // Empty but OK - consider success
          data = { success: true };
        } else {
          // Empty and not OK - error
          throw new Error(`Empty response: ${response.status} ${response.statusText}`);
        }
      }

      // Check if response indicates error
      if (!response.ok) {
        throw new Error(data.error || data.details || `Failed to save: ${response.statusText}`);
      }

      // Update local state after successful save
      setContent(newContent);
      
      return; // Success
    } catch (error) {
      console.error("Failed to save content:", error);
      
      // Re-throw with better error message
      if (error instanceof TypeError && error.message.includes("fetch")) {
        if (import.meta.env.DEV) {
          throw new Error("API endpoint not available in development. Use 'vercel dev' instead of 'npm run dev' to test saving, or deploy to Vercel.");
        }
        throw new Error("API endpoint not available. Make sure the site is deployed to Vercel.");
      }
      
      // Handle 404 specifically
      if (error instanceof Error && error.message.includes("404")) {
        if (import.meta.env.DEV) {
          throw new Error("API endpoint not found. Use 'vercel dev' for local development or deploy to Vercel.");
        }
        throw new Error("API endpoint not found. Please deploy to Vercel.");
      }
      
      throw error;
    }
  }, [setContent]);

  const resetContent = useCallback(() => {
    const defaults = cloneContent();
    setContent(defaults);
  }, []);

  const value = useMemo<ContentContextValue>(
    () => ({
      content,
      setContent,
      resetContent,
      saveContent,
      refreshContent,
    }),
    [content, resetContent, saveContent, refreshContent]
  );

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

