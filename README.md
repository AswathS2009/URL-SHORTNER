# URL Shortner

Simple URL shortener with login, custom short codes, and recent links.

## Features

- Signup/login with JWT
- Create short URLs (custom code supported)
- View your recent links
- Delete your links

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: TiDB (MySQL compatible)

## Local Setup

### 1) Backend

```bash
cd server
npm install
npm start
```

Create a `.env` in `server/`:

```
PORT=5000
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
JWT_SECRET=your-secret
JWT_EXPIRES_IN=7d
```

### 2) Frontend

```bash
cd client
npm install
npm run dev
```

Create a `.env` in `client/`:

```
VITE_API_BASE_URL=http://localhost:5000
```

## API Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /shorten` (auth)
- `GET /my-links` (auth)
- `DELETE /my-links/:id` (auth)
- `GET /:code`
