import type { VercelRequest, VercelResponse } from "@vercel/node";

// Import content.json - this works in both dev and production
let contentData: any;

try {
  contentData = require("../src/data/content.json");
} catch {
  contentData = {
    bio: { title: "", paragraphs: [] },
    concerts: [],
    links: {},
    buttonTexts: {},
    seo: {},
    assets: {},
  };
}

// GitHub API configuration
const GITHUB_OWNER = process.env.GITHUB_OWNER || "annikaxmusic";
const GITHUB_REPO = process.env.GITHUB_REPO || "annika-web";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const CONTENT_FILE_PATH = "src/data/content.json";
const GITHUB_API_BASE = "https://api.github.com";

async function getFileFromGitHub(): Promise<any | null> {
  if (!GITHUB_TOKEN) return null;

  try {
    const url = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONTENT_FILE_PATH}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      // Decode base64 content (GitHub API returns content with newlines removed)
      const contentString = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf-8");
      return JSON.parse(contentString);
    }
  } catch (error) {
    console.error("Failed to get file from GitHub:", error);
  }
  return null;
}

async function getFileSHA(): Promise<string | null> {
  if (!GITHUB_TOKEN) return null;

  try {
    const url = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONTENT_FILE_PATH}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.sha;
    }
  } catch (error) {
    console.error("Failed to get file SHA:", error);
  }
  return null;
}

async function commitToGitHub(content: any): Promise<boolean> {
  if (!GITHUB_TOKEN) {
    console.error("GITHUB_TOKEN not configured");
    return false;
  }

  try {
    const fileSHA = await getFileSHA();
    const contentString = JSON.stringify(content, null, 2);
    const contentBase64 = Buffer.from(contentString).toString("base64");

    const url = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONTENT_FILE_PATH}`;
    
    const body: any = {
      message: `Update content.json via admin panel`,
      content: contentBase64,
      branch: "main",
    };

    if (fileSHA) {
      body.sha = fileSHA;
    }

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Successfully committed to GitHub:", data.commit.html_url);
      return true;
    } else {
      const errorData = await response.text();
      console.error("GitHub API error:", response.status, errorData);
      return false;
    }
  } catch (error) {
    console.error("Failed to commit to GitHub:", error);
    return false;
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    // Try to fetch latest content from GitHub first
    if (GITHUB_TOKEN) {
      const githubContent = await getFileFromGitHub();
      if (githubContent) {
        res.status(200).json(githubContent);
        return;
      }
    }
    // Fallback to bundled content.json if GitHub fetch fails
    res.status(200).json(contentData);
    return;
  }

  if (req.method === "POST") {
    const newContent = req.body;
    
    if (!newContent || typeof newContent !== "object") {
      res.status(400).json({ error: "Invalid content" });
      return;
    }

    // Check if GitHub token is configured
    if (!GITHUB_TOKEN) {
      res.status(500).json({ 
        error: "GITHUB_TOKEN not configured",
        details: "Please set GITHUB_TOKEN environment variable in Vercel. See GITHUB_SETUP.md for instructions."
      });
      return;
    }

    // Save to GitHub
    const success = await commitToGitHub(newContent);
    
    if (success) {
      res.status(200).json({ 
        success: true, 
        message: "Content saved to content.json successfully"
      });
    } else {
      res.status(500).json({ 
        error: "Failed to save content to GitHub",
        details: "Check server logs for details. Make sure GITHUB_TOKEN has 'repo' permissions."
      });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}

