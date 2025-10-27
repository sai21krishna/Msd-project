# Render Deployment Guide

## Problem Fixed
The deployment was failing because Render was looking for `package.json` in the wrong directory (`/opt/render/project/src/`), but your backend code is in the `Backend/` folder.

## Solution Implemented
Created `render.yaml` configuration file that tells Render:
- Root directory is `Backend/`
- Build command: `npm install`
- Start command: `npm start`
- Health check endpoint: `/health`

## Next Steps

### If using render.yaml (Recommended):
1. Go to your Render dashboard
2. Create a new **Web Service** or update existing one
3. Connect your GitHub repository: `sai21krishna/Msd-project`
4. Render will automatically detect the `render.yaml` file
5. Set the following **Environment Variables** in Render dashboard:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key
   - `CLIENT_URL` - Your frontend URL (e.g., `https://your-frontend.netlify.app`)
6. Deploy!

### Alternative: Manual Configuration
If you prefer not to use render.yaml:
1. Go to Render dashboard → Your service → Settings
2. Set **Root Directory**: `Backend`
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `npm start`
5. Add environment variables (same as above)
6. Save and redeploy

## Environment Variables Required
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-secret-key-here
CLIENT_URL=https://your-frontend-url.com
NODE_ENV=production
PORT=10000
```

## Verify Deployment
Once deployed, test the health endpoint:
```
curl https://your-app.onrender.com/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Smart Medicine Backend Server is running",
  "timestamp": "2025-10-27T01:32:00.000Z"
}
```

## Common Issues

### Issue: MongoDB Connection Failed
- Ensure `MONGODB_URI` is set correctly in Render environment variables
- Whitelist Render's IP addresses in MongoDB Atlas (or use 0.0.0.0/0 for all IPs)

### Issue: CORS Errors
- Set `CLIENT_URL` environment variable to your frontend URL
- Ensure your frontend URL matches exactly (no trailing slash)

### Issue: Port Binding
- Render automatically sets `PORT` environment variable
- Your app uses `process.env.PORT` which is correct

## Project Structure
```
Mern project/
├── Backend/          ← Backend API (Node.js + Express)
│   ├── package.json
│   ├── server.js
│   └── ...
├── Frontend/         ← Frontend App (React)
│   ├── package.json
│   └── ...
└── render.yaml       ← Render configuration
```
