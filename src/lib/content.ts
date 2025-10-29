import contentData from "@/data/content.json";

export const getContent = () => {
  // Try to get content from localStorage first
  const savedContent = localStorage.getItem("siteContent");
  
  if (savedContent) {
    try {
      return JSON.parse(savedContent);
    } catch (e) {
      console.error("Failed to parse saved content", e);
      return contentData;
    }
  }
  
  return contentData;
};
