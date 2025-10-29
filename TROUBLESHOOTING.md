# Troubleshooting Guide

## Connection Refused Error (ERR_CONNECTION_REFUSED)

### Problem
Frontend shows: `Failed to load resource: net::ERR_CONNECTION_REFUSED` at `localhost:5001/api/auth/signup`

### Solution Steps

#### 1. Verify Frontend .env File
Make sure `Frontend\.env` exists and contains:
```
REACT_APP_BACKEND_BASEURL=http://localhost:5001/api
```

If the file doesn't exist, copy from `.env.example`:
```bash
cd Frontend
copy .env.example .env
```

#### 2. Verify Backend .env File  
Make sure `Backend\.env` exists with these required variables:
```
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/smart-medicine
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

If the file doesn't exist, copy from `.env.example`:
```bash
cd Backend
copy .env.example .env
```

**Important:** Update `PORT=5001` in Backend `.env` (not 5000)

#### 3. Start MongoDB
Make sure MongoDB is running:
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB (if not running)
# Windows: Start MongoDB service from Services
# Mac/Linux: mongod --dbpath /path/to/data
```

#### 4. Start Backend Server
```bash
cd Backend
npm install
npm run dev
```

You should see:
```
✅ Connected to MongoDB
📍 Registering routes...
✅ Auth routes registered at /api/auth
✅ Medication routes registered at /api/medications
🚀 Server running on 0.0.0.0:5001
```

#### 5. Start Frontend
In a new terminal:
```bash
cd Frontend
npm install
npm start
```

#### 6. Test the Connection
Open browser console and try signup. You should see detailed logs showing:
- Request being sent to `http://localhost:5001/api/auth/signup`
- Backend receiving the request
- Response from backend

### Common Issues

#### Issue: "API endpoint not found"
**Cause:** Backend is running but route not matched
**Solution:** Check backend console logs to see which URL was requested. The improved error message now shows the exact endpoint that was called.

#### Issue: MongoDB Connection Error
**Cause:** MongoDB not running or wrong connection string
**Solution:** 
1. Start MongoDB service
2. Verify `MONGODB_URI` in Backend `.env`
3. Test connection: `mongosh` or `mongo`

#### Issue: Port Already in Use
**Cause:** Another process is using port 5001
**Solution:**
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5001 | xargs kill -9
```

#### Issue: CORS Error
**Cause:** Frontend and backend URLs don't match
**Solution:** Verify `CLIENT_URL` in Backend `.env` matches your frontend URL (default: http://localhost:3000)

### Debug Checklist
- [ ] MongoDB is running
- [ ] Backend `.env` file exists with PORT=5001
- [ ] Frontend `.env` file exists with REACT_APP_BACKEND_BASEURL=http://localhost:5001/api
- [ ] Backend server is running on port 5001
- [ ] Frontend is running on port 3000
- [ ] No firewall blocking localhost connections
- [ ] Browser console shows correct API URL being called

### Enhanced Logging
The backend now includes detailed logging:
- Every incoming request is logged with timestamp, method, and URL
- Request body is logged
- 404 errors show which route was requested
- Available routes are listed in 404 responses

Check the backend console for these logs when debugging.
