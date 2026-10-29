# CarLo — Exceptional Drives

A light, editorial car marketplace with an Express/MongoDB API and a reproducible scikit-learn valuation service.

## What works

- Responsive ivory, forest-green and muted-gold design across the homepage, collection, authentication, listings, valuations and garage.
- Signup, login, server-verified cookie sessions, logout, password changes and email-based password recovery.
- Passwords hashed with bcrypt; reset tokens are hashed, expire after 30 minutes, and can be consumed once. Changing/resetting a password invalidates old sessions.
- Authenticated car listings with image validation, searchable/filterable inventory, pagination, vehicle details, seller enquiries and owner-only removal.
- Every successful valuation is stored in MongoDB with its owner, validated vehicle inputs, INR estimate, indicative range, model version, warnings and timestamp. The API reports success only after saving.
- Account dashboard for private valuation history, personal listings, buyer enquiries and password changes.
- No fake inventory, booking confirmations, payment processing or fabricated customer counts.

## Requirements

Node.js 22+, Python 3.10+, MongoDB 8 (or a compatible hosted MongoDB), and npm.

### Install

From the repository root:

```powershell
npm --prefix cars install
npm --prefix cars-backend install
python -m venv cars-backend/ml/.venv
cars-backend/ml/.venv/Scripts/python.exe -m pip install -r cars-backend/ml/requirements.txt
```

The trained `valuation_pipeline.joblib` and evaluation report are included. Retrain when changing dependencies, features or source data:

```powershell
cars-backend/ml/.venv/Scripts/python.exe cars-backend/ml/train.py
```

On macOS/Linux, use `cars-backend/ml/.venv/bin/python`. Set `PYTHON_BIN` if using a different interpreter.

### Run everything with an isolated local database

```powershell
npm run dev:local
```

The launcher starts local MongoDB, the ML service, API and Vite, checks readiness, and prints the website URL (normally [localhost:5173](http://localhost:5173)). It stores development records under ignored `.runtime/development-db`, separate from any configured hosted database. Accounts persist; the development session secret changes on restart, requiring a new login.

On Windows, it defaults to `C:/Program Files/MongoDB/Server/8.0/bin/mongod.exe`; set `MONGOD_BIN` for another installation. The launcher stops if ports are already occupied. Override `FRONTEND_PORT`, `PORT`, `ML_PORT` and `LOCAL_MONGO_PORT` if necessary. Ctrl+C stops its services.

### Run against your configured database

Copy `cars-backend/.env.example` to `cars-backend/.env` only if you do not already have one. Set:

- `MONGODB_URI`: your MongoDB connection string.
- `JWT_SECRET`: at least 32 randomly generated characters.
- `FRONTEND_URL`: allowed browser origins, comma-separated if needed.
- `ML_API_URL`: private ML service URL.

Run `npm run dev` from the root. This starts ML, API and frontend using the configured database. It never seeds or rewrites existing user data.

The frontend uses `VITE_API_URL=/api` and Vite proxies both `/api` and `/uploads` to the API. This avoids localhost/127.0.0.1 cookie mismatches. The old `VITE_ML_URL` is no longer used: browser valuations always go through the authenticated backend.

### Email recovery

Configure these backend variables to enable forgotten-password emails:

```dotenv
APP_URL=https://your-frontend.example
RESEND_API_KEY=your-provider-key
EMAIL_FROM=CarLo <accounts@your-verified-domain.example>
```

Use a verified sending domain. Until configured, the recovery form clearly reports that email recovery is unavailable. No reset token is returned from the API or logged. The token is placed in the link fragment to avoid web-server access logs. Integration tests mock the provider and do not send real email.

## Model and measured performance

The former predictor used a small dataset, separate scaler/model artifacts and implicit numeric category codes. The replacement uses the larger supplied **Car details v3.csv**, explicit category strings, model/brand identity and vehicle specifications.

Training removes duplicate records and groups identical feature rows before splitting, aggregates conflicting prices by median, fits preprocessing on training data only, and compares Extra Trees, Random Forest and histogram gradient boosting on validation MAE. A log-transformed target improves behavior across the price range. The selected model and preprocessing are saved together.

The committed report `cars-backend/ml/model_metrics.json` records dataset fingerprint, versions, split counts, metrics, selection scores and supported models.

| Held-out evaluation | Result |
| --- | --- |
| Train / validation / test rows | 4,689 / 1,005 / 1,005 |
| Selected candidate | Histogram gradient boosting |
| R² | 0.9444 |
| Mean absolute error | ₹70,899 |
| Median absolute percentage error | 11.27% |
| Median-price baseline MAE | ₹2,79,022 |
| Median-price baseline median percentage error | 42.86% |

These figures compare the new model with a simple baseline on the same held-out test set; they are not a measured comparison with the old artifact.

**Limits:** the supplied dataset describes historical listings through 2020, not present-day completed sales. Vehicle age is computed relative to 2020 when training and the current year at inference; newer model years and ages outside training support are flagged. The model cannot establish current-market accuracy, physical condition, local demand, inflation, accident history or EV values. New, representative transaction data is needed to establish current pricing accuracy.

The indicative range uses a 90th-percentile absolute log residual on validation data. Validation is also used for candidate selection, so this is an empirical range, not an independently calibrated confidence guarantee. Coverage on the historical test set was 91.24%. Optional omitted specifications use training-set median imputation and trigger a visible warning.

All model predictions and database prices use **INR**, never mixed rupee/lakh units. Only supported models/fuels are accepted. Invalid numbers, negative mileage, unsupported categories and malformed requests are rejected.

## Verification

```powershell
npm run lint
npm run build
npm run test:ml
```

API integration tests require a local MongoDB listening on **27029** and the ML service on **5000**. Set `TEST_MONGO_PORT` and `ML_API_URL` to override those test endpoints:

```powershell
npm run test:api
```

Tests create a uniquely named `carlo_test_*` database and drop only that database after completion. They cover signup/login, cookie sessions, hashing, duplicate accounts, origin protection, real ML output and persistence, invalid inputs, uploads and file signatures, account isolation, ownership checks, enquiries, password changes, revocation, outage handling and single-use email recovery with a mocked provider.

The ML suite covers deterministic output, price ranges, malformed/non-finite values, missing specifications, category validation, health/options, duplicate removal and the held-out baseline comparison.

Browser QA verified desktop/mobile layout, signup, session restoration, real prediction, saved history after reload, and the responsive menu.

## Production setup

- Serve the frontend and API from the same site where possible. If using separate HTTPS sites, set `VITE_API_URL` to the API URL, allow the exact frontend origin, and use `NODE_ENV=production` with `COOKIE_SAME_SITE=none`. Third-party cookie restrictions may still apply; a same-origin reverse proxy is preferred.
- Keep the ML service private and reachable by the backend. Run `python app.py` using Waitress. Set its `PORT`; `NODE_ENV=production` binds it to all interfaces for container hosting.
- Listing photos require a **persistent API server volume** mounted at `cars-backend/uploads`. The existing Vercel serverless API configuration cannot durably store local uploads; listing creation therefore reports an actionable error on that platform. Use a persistent Node host or implement object storage before deploying listings on serverless infrastructure.
- Configure MongoDB backups, HTTPS, email recovery and a stable JWT secret.
- Rate limiting currently uses a bounded in-memory map for one API instance. Use a shared rate-limit store when scaling, and configure proxy trust only for your actual trusted proxy topology.
- The previous backend `.env` was tracked in Git. It has been removed from tracking while kept locally. Rotate any real secrets previously committed; removal does not erase Git history.
- Existing legacy listing documents without an owner remain in the database but are excluded from public inventory. Link them to their verified owners and fill required fields before republishing. Existing users can log in with their stored bcrypt passwords; old JWT sessions require signing in again. A legacy unique username index, if present, can be reviewed separately before allowing duplicate display names.
- Payments, vehicle inspection/certification, email verification and automated seller email notifications are not implemented. Enquiries are stored in the seller dashboard; the seller can respond using the buyer's explicitly shared email.
