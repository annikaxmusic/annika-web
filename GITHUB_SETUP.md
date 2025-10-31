# GitHub API Setup for Content Management

To enable saving changes directly to `content.json`, you need to configure a GitHub Personal Access Token.

## Step-by-Step: Create GitHub Token

### Step 1: Go to GitHub Settings
1. Open https://github.com and sign in
2. Click your profile picture (top right corner)
3. Click **Settings**

### Step 2: Navigate to Developer Settings
1. In the left sidebar, scroll down to **Developer settings** (at the bottom)
2. Click **Developer settings**

### Step 3: Create Personal Access Token
1. Click **Personal access tokens** → **Tokens (classic)**
2. Click **Generate new token** → **Generate new token (classic)**
3. If prompted, enter your password or 2FA code

### Step 4: Configure the Token
1. **Note**: Give it a descriptive name like `annika-web-content-editor`
2. **Expiration**: Choose how long it should last (90 days, 1 year, or No expiration)
3. **Select scopes**: Check the **`repo`** checkbox
   - This gives full control of private repositories
   - Required to commit changes to `content.json`
4. Scroll down and click **Generate token**

### Step 5: Copy the Token
1. **IMPORTANT**: Copy the token immediately (it starts with `ghp_`)
2. You won't be able to see it again!
3. If you lose it, you'll need to delete and create a new token

### Step 6: Add to Vercel
1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   - **Key**: `GITHUB_TOKEN`
   - **Value**: Paste your token
   - **Environments**: Select all (Production, Preview, Development)
6. Click **Save**

### Step 7: Redeploy
1. After adding the environment variable, go to **Deployments**
2. Click the three dots on the latest deployment → **Redeploy**
3. Or push a new commit to trigger auto-deploy

## Setup Instructions (Quick Reference)

1. **Create a GitHub Personal Access Token:**
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a name like "annika-web-content-editor"
   - Select scopes: `repo` (full control of private repositories)
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again)

2. **Add to Vercel Environment Variables:**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add the following variables:
     - `GITHUB_TOKEN` = your personal access token
     - `GITHUB_OWNER` = `annikaxmusic` (optional, defaults to this)
     - `GITHUB_REPO` = `annika-web` (optional, defaults to this)

3. **Redeploy:**
   - After adding environment variables, redeploy your Vercel project
   - The changes will take effect on the next deployment

## Development Mode

**Important:** In development, API endpoints only work when:
- **Deployed to Vercel** (recommended for production)
- **Using `vercel dev`** (for local testing with API)

### Local Development with API Support

To test saving locally, use Vercel CLI instead of `npm run dev`:

```bash
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Run development server with API support
vercel dev
```

This will:
- Start the dev server (usually on port 3000)
- Enable `/api/content` endpoint
- Allow you to test saving functionality locally

**Note:** You still need `GITHUB_TOKEN` set as an environment variable. You can create a `.env.local` file:
```
GITHUB_TOKEN=your_token_here
```

### Regular Development (`npm run dev`)

When using `npm run dev`:
- ✅ Frontend works normally
- ✅ Content is read from `content.json`
- ❌ Saving won't work (API endpoint not available)
- You'll see a warning message in the admin panel

## How It Works

- When you save changes in the admin panel, it commits directly to `src/data/content.json` in your GitHub repository
- The commit is made to the `main` branch
- After the commit, Vercel will automatically redeploy (if auto-deploy is enabled)
- All visitors will see the updated content

## Security Note

- Keep your `GITHUB_TOKEN` secret
- Never commit it to your repository
- Only add it as a Vercel environment variable (or `.env.local` for local dev)
- If the token is compromised, revoke it immediately and create a new one
