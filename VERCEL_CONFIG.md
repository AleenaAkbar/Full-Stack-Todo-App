# 🚨 URGENT: Fix Vercel Configuration

## Current Problem
Your Vercel app is still trying to connect to `localhost:5000` because the environment variable isn't set.

## 🔧 IMMEDIATE FIX NEEDED

### Step 1: Find Your Railway Backend URL
1. Go to https://railway.app/dashboard
2. Click on your todo backend project
3. Look for "Domains" section
4. Copy the URL that looks like: `https://todo-backend-production-xxxx.up.railway.app`

### Step 2: Set Environment Variable in Vercel
1. Go to https://vercel.com/dashboard
2. Find your todo frontend project
3. Click on it
4. Go to "Settings" tab
5. Click "Environment Variables" in left sidebar
6. Click "Add New"
7. Set:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-actual-railway-url.railway.app`
   - **Environment**: Production
8. Click "Save"

### Step 3: Redeploy
1. Go to "Deployments" tab
2. Click the 3 dots on latest deployment
3. Click "Redeploy"

## 🆘 If You Can't Find Railway URL

### Alternative: Create vercel.json
If you can't find the Railway URL, create this file in your client folder:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-railway-url.railway.app/api/$1"
    },
    {
      "source": "/auth/(.*)",
      "destination": "https://your-railway-url.railway.app/auth/$1"
    },
    {
      "source": "/todos/(.*)",
      "destination": "https://your-railway-url.railway.app/todos/$1"
    }
  ]
}
```

## 🔍 Quick Debug
1. Open browser console on your Vercel app
2. Look for network errors
3. Check if requests are going to localhost:5000
4. If yes, environment variable is not set correctly
