# Railway Deployment Guide - URL Shortener

## Quick Start Deployment

### Option 1: Deploy Both Services (Recommended for Production)

Railway will automatically detect this monorepo and deploy both services.

#### Step 1: Connect to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Railway will auto-detect the `railway.toml` configuration

#### Step 2: Configure Backend Service

1. In Railway dashboard, add a new service → "Node.js"
2. Set the root directory to `server`
3. Add environment variables:
   ```
   DB_HOST=your_tidbcloud_host
   DB_USER=your_database_user
   DB_PASS=your_database_password
   DB_NAME=urlShortner
   JWT_SECRET=your_secure_random_key
   JWT_EXPIRES_IN=7d
   ```
4. Railway will automatically set `PORT` for you

#### Step 3: Configure Frontend Service

1. Add another new service → "Node.js"
2. Set the root directory to `client`
3. Add environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend-service.railway.app
   ```
4. Build command will run automatically

#### Step 4: Get Service URLs

After deployment:

- Backend URL: Check the "Networking" tab in backend service
- Frontend URL: Check the "Networking" tab in frontend service

Copy the backend URL and update the frontend's `VITE_API_BASE_URL` environment variable with it.

---

### Option 2: Deploy Backend Only (Monolith Approach)

If you want to serve the frontend from the backend:

#### Prepare Backend for Frontend Hosting

1. Update [server/app.js](../server/app.js) to serve static files:

```javascript
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from client build directory
app.use(express.static(path.join(__dirname, "../client/dist")));

const urlRoutes = require("./routes/urlRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/", urlRoutes);
app.use("/api/auth", authRoutes);

// Serve index.html for all other routes (SPA routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

module.exports = app;
```

2. Update [server/package.json](../server/package.json) build scripts:

```json
"scripts": {
  "dev": "nodemon server.js",
  "start": "node server.js",
  "build": "cd ../client && npm install && npm run build && cd ../server"
}
```

3. Deploy as single service with these environment variables:
   ```
   DB_HOST=your_tidbcloud_host
   DB_USER=your_database_user
   DB_PASS=your_database_password
   DB_NAME=urlShortner
   JWT_SECRET=your_secure_random_key
   ```

---

## Troubleshooting

### Build Fails with "Cannot find module"

**Solution:** Ensure all dependencies are in package.json, not just package-lock.json

```bash
cd server && npm install
cd ../client && npm install
```

### Frontend Can't Connect to Backend

**Problem:** `Unable to connect to server` error in browser

**Solution:**

1. Check CORS is enabled in [server/app.js](../server/app.js)
2. Verify `VITE_API_BASE_URL` environment variable matches backend URL
3. Check browser console (F12) for the actual requests

### Database Connection Error

**Problem:** `connect ENOTFOUND DB_HOST`

**Solution:**

1. Verify database credentials are correct
2. Allow Railway IP to connect to your TiDB Cloud database
3. Test locally first:
   ```bash
   cd server
   npm install
   npm run dev
   ```

### Port Issues

Railway automatically assigns a port via `process.env.PORT`. This is already handled in [server/server.js](../server/server.js).

---

## Environment Variables Reference

### Server (.env)

```
PORT=5000 (auto-set by Railway)
DB_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com
DB_USER=your_username.root
DB_PASS=your_password
DB_NAME=urlShortner
JWT_SECRET=any_random_string_min_20_chars
JWT_EXPIRES_IN=7d
```

### Client (.env)

```
VITE_API_BASE_URL=https://your-backend-railway-app.up.railway.app
```

---

## Post-Deployment Testing

1. **Test Signup/Login:**
   - Open frontend URL
   - Create new account
   - Verify you can log in

2. **Test URL Shortening:**
   - Shorten a URL with auto-generated code
   - Shorten a URL with custom code
   - Verify links are saved

3. **Test Recent Links:**
   - Log in
   - Verify your recent links display
   - Test delete functionality

4. **Test Direct Redirect:**
   - Copy a shortened URL
   - Open it in new tab
   - Should redirect to original URL

---

## Deployment Checklist

- [ ] Push all code to GitHub
- [ ] Database credentials are secure (in Railway env vars, not in code)
- [ ] JWT_SECRET is a strong random string
- [ ] Backend URL is set in frontend VITE_API_BASE_URL
- [ ] CORS is enabled on backend
- [ ] All npm dependencies are installed locally before push
- [ ] No .env files committed to Git
- [ ] railway.toml file is in repository root

---

## Support

If you encounter issues:

1. Check Railway build logs in dashboard
2. Verify all environment variables are set
3. Test locally first to ensure code works
4. Check database connectivity from Railway
