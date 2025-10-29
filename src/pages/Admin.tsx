import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import contentData from "@/data/content.json";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [content, setContent] = useState(contentData);

  useEffect(() => {
    if (localStorage.getItem("adminAuth") !== "true") {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  const handleSave = () => {
    const jsonString = JSON.stringify(content, null, 2);
    
    // Save to localStorage
    localStorage.setItem("siteContent", jsonString);
    
    // Download JSON file
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "content.json";
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ 
      title: "Saved!", 
      description: "Changes applied. Replace content.json in your repo with the downloaded file." 
    });
  };

  const updateBioParagraph = (index: number, value: string) => {
    const newParagraphs = [...content.bio.paragraphs];
    newParagraphs[index] = value;
    setContent({ ...content, bio: { ...content.bio, paragraphs: newParagraphs } });
  };

  const addBioParagraph = () => {
    setContent({
      ...content,
      bio: { ...content.bio, paragraphs: [...content.bio.paragraphs, ""] }
    });
  };

  const removeBioParagraph = (index: number) => {
    const newParagraphs = content.bio.paragraphs.filter((_, i) => i !== index);
    setContent({ ...content, bio: { ...content.bio, paragraphs: newParagraphs } });
  };

  const updateConcert = (index: number, field: "event" | "date" | "url", value: string) => {
    const newConcerts = [...content.concerts];
    newConcerts[index] = { ...newConcerts[index], [field]: value };
    setContent({ ...content, concerts: newConcerts });
  };

  const addConcert = () => {
    setContent({
      ...content,
      concerts: [...content.concerts, { event: "", date: "", url: "" }]
    });
  };

  const removeConcert = (index: number) => {
    const newConcerts = content.concerts.filter((_, i) => i !== index);
    setContent({ ...content, concerts: newConcerts });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              Save Changes
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
              value={content.bio.title}
              onChange={(e) => setContent({ ...content, bio: { ...content.bio, title: e.target.value } })}
            />
          </div>

          <div className="space-y-4">
            <Label>Paragraphs</Label>
            {content.bio.paragraphs.map((paragraph, index) => (
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
          
          {content.concerts.map((concert, index) => (
            <div key={index} className="space-y-2 border-b pb-4 mb-4">
              <div className="flex gap-2 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Event</Label>
                  <Input
                    value={concert.event}
                    onChange={(e) => updateConcert(index, "event", e.target.value)}
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label>Date</Label>
                  <Input
                    value={concert.date}
                    onChange={(e) => updateConcert(index, "date", e.target.value)}
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
              value={content.links.tip}
              onChange={(e) => setContent({ ...content, links: { ...content.links, tip: e.target.value } })}
            />
          </div>

          <div className="space-y-2">
            <Label>Press Link</Label>
            <Input
              value={content.links.press}
              onChange={(e) => setContent({ ...content, links: { ...content.links, press: e.target.value } })}
            />
          </div>

          <div className="space-y-2">
            <Label>Spotify Link</Label>
            <Input
              value={content.links.spotify}
              onChange={(e) => setContent({ ...content, links: { ...content.links, spotify: e.target.value } })}
            />
          </div>

          <div className="space-y-2">
            <Label>YouTube Embed URL</Label>
            <Input
              value={content.links.youtube}
              onChange={(e) => setContent({ ...content, links: { ...content.links, youtube: e.target.value } })}
            />
          </div>

          <div className="space-y-2">
            <Label>Instagram Link</Label>
            <Input
              value={content.links.instagram}
              onChange={(e) => setContent({ ...content, links: { ...content.links, instagram: e.target.value } })}
            />
          </div>

          <div className="space-y-2">
            <Label>YouTube Channel Link</Label>
            <Input
              value={content.links.youtubeChannel}
              onChange={(e) => setContent({ ...content, links: { ...content.links, youtubeChannel: e.target.value } })}
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={content.links.email}
              onChange={(e) => setContent({ ...content, links: { ...content.links, email: e.target.value } })}
            />
          </div>
        </section>

        {/* Button Texts */}
        <section className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold">Button Texts</h2>
          
          <div className="space-y-2">
            <Label>Tip Button Text</Label>
            <Input
              value={content.buttonTexts.tip}
              onChange={(e) => setContent({ ...content, buttonTexts: { ...content.buttonTexts, tip: e.target.value } })}
            />
          </div>

          <div className="space-y-2">
            <Label>Press Button Text</Label>
            <Input
              value={content.buttonTexts.press}
              onChange={(e) => setContent({ ...content, buttonTexts: { ...content.buttonTexts, press: e.target.value } })}
            />
          </div>
        </section>

        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>How it works:</strong> Click "Save Changes" to apply edits immediately and download content.json. 
            Replace the file in your repository with the downloaded version and redeploy for permanent changes.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Admin;
