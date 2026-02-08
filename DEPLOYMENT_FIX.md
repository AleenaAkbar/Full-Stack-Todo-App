# 🚀 Todo App Deployment Fix Guide

## Problem
Your frontend on Vercel is showing "Something went wrong. Try again." because it's trying to connect to `localhost:5000` instead of your Railway backend.

## ✅ Solution Steps

### 1. Get Your Railway Backend URL
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Find your todo backend project
3. Click on your service
4. Go to "Settings" tab
5. Copy the "Domain" URL (it looks like: `https://your-project-name-production.up.railway.app`)

### 2. Set Environment Variable in Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your todo frontend project
3. Go to "Settings" tab
4. Click on "Environment Variables"
5. Add a new environment variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-railway-backend-url.railway.app` (replace with your actual Railway URL)
   - **Environment**: Production
6. Click "Save"

### 3. Redeploy Your Vercel App
1. In Vercel dashboard, go to "Deployments" tab
2. Click on the latest deployment
3. Click "Redeploy" button
4. Wait for deployment to complete

### 4. Test Your App
1. Go to your Vercel app URL: `https://todo-frontend-blond-three.vercel.app`
2. Try to access the signup page
3. The error should be resolved

## 🔧 Additional Backend Configuration

### Railway Environment Variables (if needed)
If your Railway backend needs environment variables:
1. Go to Railway dashboard
2. Select your backend service
3. Go to "Variables" tab
4. Add any required environment variables:
   - `MONGODB_URI` (if not hardcoded)
   - `SECRET` (for JWT)
   - `PORT` (usually 5000)

### CORS Configuration
The backend CORS has been updated to allow:
- `https://todo-frontend-blond-three.vercel.app`
- All Vercel domains (`https://*.vercel.app`)
- Local development URLs

## 🐛 Troubleshooting

### If still getting errors:
1. **Check Railway backend logs**:
   - Go to Railway dashboard
   - Click on your backend service
   - Go to "Deployments" tab
   - Check logs for any errors

2. **Verify MongoDB Atlas connection**:
   - Check if your MongoDB Atlas cluster is running
   - Verify network access settings allow all IPs (0.0.0.0/0)

3. **Test backend directly**:
   - Try accessing `https://your-railway-backend-url.railway.app` in browser
   - Should show "Hello from Todo Backend 🚀"

4. **Check Vercel environment variables**:
   - Make sure `VITE_API_URL` is set correctly
   - Redeploy after adding environment variables

## 📝 Quick Checklist
- [ ] Railway backend URL copied
- [ ] `VITE_API_URL` set in Vercel
- [ ] Vercel app redeployed
- [ ] Backend accessible via URL
- [ ] MongoDB Atlas connected
- [ ] CORS configured correctly

## 🎯 Expected Result
After completing these steps, your signup page should work without the "Something went wrong" error.
