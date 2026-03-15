# cars-sell

Monorepo with three parts:
1. `cars` — React + Vite frontend
2. `cars-backend` — Express API
3. `cars-backend/ml` — Flask ML API

## Local Development

Frontend:
```powershell
cd cars
npm install
npm run dev
```

Backend:
```powershell
cd cars-backend
npm install
node server.js
```

ML API:
```powershell
cd cars-backend/ml
python app.py
```

## Environment Variables

Frontend (`cars/.env` for local):
```
VITE_API_URL=http://localhost:3000/api
VITE_ML_URL=http://127.0.0.1:5000
```

Backend (set in Vercel or local `.env`):
```
MONGODB_URI=...
JWT_SECRET=...
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## Lint / Build

```powershell
cd cars
npm run lint
npm run build
```

## Deployment Plan

### 1) Frontend on Vercel
- Root directory: `cars`
- Build command: `npm run build`
- Output: `dist`
- Env vars:
  - `VITE_API_URL=https://<backend>.vercel.app/api`
  - `VITE_ML_URL=https://<ml-service>.onrender.com`
- `cars/vercel.json` is included to handle SPA routes.

### 2) Backend on Vercel
- Root directory: `cars-backend`
- `cars-backend/vercel.json` handles routing to `server.js`
- Env vars:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `FRONTEND_URL=https://<frontend>.vercel.app`
  - `NODE_ENV=production`

### 3) ML API on Render or Railway (recommended)
- Root directory: `cars-backend/ml`
- Build: `pip install -r requirements.txt`
- Start: `python app.py`
- The server reads `PORT` from the platform.

## Notes
- Vercel’s filesystem is read-only. Avoid local file uploads in production.
