import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useContent } from "@/context/ContentContext";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { content, saveContent } = useContent();
  const [draftContent, setDraftContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDraftContent(content);
  }, [content]);

  useEffect(() => {
    if (localStorage.getItem("adminAuth") !== "true") {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveContent(draftContent);
      toast({
        title: "Saved!",
        description: "Changes saved to content.json and will be visible to everyone.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save changes";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateBioParagraph = (index: number, value: string) => {
    setDraftContent((prev) => {
      const paragraphs = [...prev.bio.paragraphs];
      paragraphs[index] = value;
      return { ...prev, bio: { ...prev.bio, paragraphs } };
    });
  };

  const addBioParagraph = () => {
    setDraftContent((prev) => ({
      ...prev,
      bio: { ...prev.bio, paragraphs: [...prev.bio.paragraphs, ""] },
    }));
  };

  const removeBioParagraph = (index: number) => {
    setDraftContent((prev) => ({
      ...prev,
      bio: {
        ...prev.bio,
        paragraphs: prev.bio.paragraphs.filter((_, i) => i !== index),
      },
    }));
  };

  const updateConcert = (index: number, field: "event" | "date" | "time" | "url", value: string) => {
    setDraftContent((prev) => {
      const concerts = [...prev.concerts];
      concerts[index] = { ...concerts[index], [field]: value };
      return { ...prev, concerts };
    });
  };

  const addConcert = () => {
    setDraftContent((prev) => ({
      ...prev,
      concerts: [...prev.concerts, { event: "", date: "", time: "", url: "" }],
    }));
  };

  const removeConcert = (index: number) => {
    setDraftContent((prev) => ({
      ...prev,
      concerts: prev.concerts.filter((_, i) => i !== index),
    }));
  };

  const handleLinkChange = (field: keyof typeof draftContent.links, value: string) => {
    setDraftContent((prev) => ({
      ...prev,
      links: { ...prev.links, [field]: value },
    }));
  };

  const handleButtonTextChange = (field: keyof typeof draftContent.buttonTexts, value: string) => {
    setDraftContent((prev) => ({
      ...prev,
      buttonTexts: { ...prev.buttonTexts, [field]: value },
    }));
  };

  const handleSeoChange = (field: keyof typeof draftContent.seo, value: string) => {
    setDraftContent((prev) => ({
      ...prev,
      seo: { ...prev.seo, [field]: value },
    }));
  };

  const handleAssetFieldChange = (field: keyof typeof draftContent.assets, value: string) => {
    setDraftContent((prev) => ({
      ...prev,
      assets: { ...prev.assets, [field]: value },
    }));
  };

  type UploadableAssetKey = "ogImage" | "favicon" | "appleTouchIcon" | "footerImage" | "tipImage";

  const handleAssetUpload = (field: UploadableAssetKey) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setDraftContent((prev) => ({
        ...prev,
        assets: { ...prev.assets, [field]: result },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAssetReset = (field: UploadableAssetKey) => {
    setDraftContent((prev) => ({
      ...prev,
      assets: { ...prev.assets, [field]: "" },
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Bio Section */}
        <section className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold">Bio Section</h2>
          
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={draftContent.bio.title}
              onChange={(e) => setDraftContent((prev) => ({
                ...prev,
                bio: { ...prev.bio, title: e.target.value },
              }))}
            />
          </div>

          <div className="space-y-4">
            <Label>Paragraphs</Label>
            {draftContent.bio.paragraphs.map((paragraph, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={paragraph}
                  onChange={(e) => updateBioParagraph(index, e.target.value)}
                  rows={2}
                />
                <Button 
                  onClick={() => removeBioParagraph(index)} 
                  variant="destructive"
                  size="sm"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button onClick={addBioParagraph} variant="outline" size="sm">
              + Add Paragraph
            </Button>
          </div>
        </section>

        {/* Concerts Section */}
        <section className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold">Concerts</h2>
          
          {draftContent.concerts.map((concert, index) => (
            <div key={index} className="space-y-2 border-b pb-4 mb-4">
              <div className="flex flex-wrap gap-2 items-end">
                <div className="flex-1 min-w-[200px] space-y-2">
                  <Label>Event</Label>
                  <Input
                    value={concert.event}
                    onChange={(e) => updateConcert(index, "event", e.target.value)}
                  />
                </div>
                <div className="w-40 space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={concert.date ?? ""}
                    onChange={(e) => updateConcert(index, "date", e.target.value)}
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={concert.time ?? ""}
                    onChange={(e) => updateConcert(index, "time", e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => removeConcert(index)} 
                  variant="destructive"
                  size="sm"
                >
                  Remove
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Link (optional)</Label>
                <Input
                  placeholder="https://..."
                  value={concert.url}
                  onChange={(e) => updateConcert(index, "url", e.target.value)}
                />
              </div>
            </div>
          ))}
          
          <Button onClick={addConcert} variant="outline" size="sm">
            + Add Concert
          </Button>
        </section>

        {/* Links Section */}
        <section className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold">Links</h2>
          
          <div className="space-y-2">
            <Label>Tip Link</Label>
            <Input
              value={draftContent.links.tip}
              onChange={(e) => handleLinkChange("tip", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Press Link</Label>
            <Input
              value={draftContent.links.press}
              onChange={(e) => handleLinkChange("press", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Spotify Link</Label>
            <Input
              value={draftContent.links.spotify}
              onChange={(e) => handleLinkChange("spotify", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>YouTube Embed URL</Label>
            <Input
              value={draftContent.links.youtube}
              onChange={(e) => handleLinkChange("youtube", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Instagram Link</Label>
            <Input
              value={draftContent.links.instagram}
              onChange={(e) => handleLinkChange("instagram", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>YouTube Channel Link</Label>
            <Input
              value={draftContent.links.youtubeChannel}
              onChange={(e) => handleLinkChange("youtubeChannel", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={draftContent.links.email}
              onChange={(e) => handleLinkChange("email", e.target.value)}
            />
          </div>
        </section>

        {/* Button Texts */}
        <section className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold">Button Texts</h2>
          
          <div className="space-y-2">
            <Label>Tip Button Text</Label>
            <Input
              value={draftContent.buttonTexts.tip}
              onChange={(e) => handleButtonTextChange("tip", e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Tip Section Image (Photo or GIF)</Label>
            <p className="text-xs text-muted-foreground">Upload an image/GIF to display under the Tip button</p>
            {draftContent.assets.tipImage ? (
              <div className="space-y-2">
                <img
                  src={draftContent.assets.tipImage}
                  alt="Tip section preview"
                  className="w-full max-w-md rounded border"
                />
                <Button variant="outline" size="sm" onClick={() => handleAssetReset("tipImage")}>
                  Remove Image
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No image uploaded</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAssetUpload("tipImage")}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border file:border-input file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-secondary/80"
            />
          </div>

          <div className="space-y-2">
            <Label>Press Button Text</Label>
            <Input
              value={draftContent.buttonTexts.press}
              onChange={(e) => handleButtonTextChange("press", e.target.value)}
            />
          </div>
        </section>

        {/* SEO */}
        <section className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold">SEO & Metadata</h2>

          <div className="space-y-2">
            <Label htmlFor="seo-title">Site Title</Label>
            <Input
              id="seo-title"
              value={draftContent.seo.title}
              onChange={(e) => handleSeoChange("title", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo-description">Meta Description</Label>
            <Textarea
              id="seo-description"
              value={draftContent.seo.description}
              onChange={(e) => handleSeoChange("description", e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">Keep between 120-160 characters for best search preview.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo-keywords">Keywords (comma separated)</Label>
            <Input
              id="seo-keywords"
              value={draftContent.seo.keywords}
              onChange={(e) => handleSeoChange("keywords", e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="seo-author">Author</Label>
              <Input
                id="seo-author"
                value={draftContent.seo.author}
                onChange={(e) => handleSeoChange("author", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seo-twitter">Twitter / X Handle</Label>
              <Input
                id="seo-twitter"
                value={draftContent.seo.twitterHandle}
                onChange={(e) => handleSeoChange("twitterHandle", e.target.value)}
                placeholder="@annikaxmusic"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo-canonical">Canonical URL</Label>
            <Input
              id="seo-canonical"
              value={draftContent.seo.canonicalUrl}
              onChange={(e) => handleSeoChange("canonicalUrl", e.target.value)}
              placeholder="https://annika.com/"
            />
            <p className="text-xs text-muted-foreground">Use your live domain so search engines know the primary URL.</p>
          </div>
        </section>

        {/* Assets */}
        <section className="border rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-bold">Images & Icons</h2>

          <div className="space-y-3">
            <Label>Open Graph / Social Share Image</Label>
            {draftContent.assets.ogImage ? (
              <img
                src={draftContent.assets.ogImage}
                alt="Open Graph preview"
                className="w-full max-w-lg rounded border"
              />
            ) : (
              <p className="text-sm text-muted-foreground">Using default og-image.png (1200×630 recommended).</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAssetUpload("ogImage")}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border file:border-input file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-secondary/80"
            />
            {draftContent.assets.ogImage && (
              <Button variant="outline" size="sm" onClick={() => handleAssetReset("ogImage")}>Reset to default</Button>
            )}
          </div>

          <div className="space-y-3">
            <Label>Favicon (32×32 PNG or ICO)</Label>
            {draftContent.assets.favicon ? (
              <img src={draftContent.assets.favicon} alt="Favicon preview" className="h-12 w-12 rounded border" />
            ) : (
              <p className="text-sm text-muted-foreground">Using default favicon.png.</p>
            )}
            <input
              type="file"
              accept="image/png,image/x-icon,image/svg+xml"
              onChange={handleAssetUpload("favicon")}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border file:border-input file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-secondary/80"
            />
            {draftContent.assets.favicon && (
              <Button variant="outline" size="sm" onClick={() => handleAssetReset("favicon")}>Reset to default</Button>
            )}
          </div>

          <div className="space-y-3">
            <Label>Apple Touch Icon (512×512 PNG)</Label>
            {draftContent.assets.appleTouchIcon ? (
              <img
                src={draftContent.assets.appleTouchIcon}
                alt="Apple touch icon preview"
                className="h-20 w-20 rounded border"
              />
            ) : (
              <p className="text-sm text-muted-foreground">Using default apple-touch-icon.png.</p>
            )}
            <input
              type="file"
              accept="image/png"
              onChange={handleAssetUpload("appleTouchIcon")}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border file:border-input file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-secondary/80"
            />
            {draftContent.assets.appleTouchIcon && (
              <Button variant="outline" size="sm" onClick={() => handleAssetReset("appleTouchIcon")}>Reset to default</Button>
            )}
          </div>

          <div className="space-y-3">
            <Label>Footer Image</Label>
            {draftContent.assets.footerImage ? (
              <img
                src={draftContent.assets.footerImage}
                alt="Footer preview"
                className="w-full max-w-lg rounded border"
              />
            ) : (
              <p className="text-sm text-muted-foreground">Using the default band photo from the site.</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAssetUpload("footerImage")}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border file:border-input file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-secondary/80"
            />
            {draftContent.assets.footerImage && (
              <Button variant="outline" size="sm" onClick={() => handleAssetReset("footerImage")}>Reset to default</Button>
            )}

            <div className="space-y-2">
              <Label htmlFor="footer-image-alt">Footer Image Alt Text</Label>
              <Input
                id="footer-image-alt"
                value={draftContent.assets.footerImageAlt}
                onChange={(e) => handleAssetFieldChange("footerImageAlt", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Describe the image for accessibility and search engines.</p>
            </div>
          </div>
        </section>

        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Click "Save Changes" to save your edits directly to content.json in the repository. Changes will be visible to all visitors once saved and deployed.
          </p>
          {import.meta.env.DEV && (
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2 font-medium">
              ⚠️ Development Mode: API endpoints only work when deployed to Vercel or using <code className="bg-background px-1 rounded">vercel dev</code>. 
              Use <code className="bg-background px-1 rounded">vercel dev</code> instead of <code className="bg-background px-1 rounded">npm run dev</code> to test saving locally.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
