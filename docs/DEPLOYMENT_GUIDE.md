# Memora Production Deployment Guide (Vercel & Render)

This guide walks you through deploying **Memora** for live production testing:
- **Backend API**: Hosted on [Render](https://render.com) (Laravel 12 via Docker) + Render Managed PostgreSQL
- **Frontend**: Hosted on [Vercel](https://vercel.com) (Next.js 16)

---

## 1. Backend Deployment on Render

### Option A: 1-Click Blueprint (Recommended)
Memora includes a preconfigured [render.yaml](file:///c:/Users/basco/Devs/memora/render.yaml) blueprint at the repository root.

1. Push your latest code to your GitHub repository (e.g. `main` branch).
2. Log in to [Render](https://dashboard.render.com).
3. Click **New +** > **Blueprint**.
4. Connect your GitHub repository (`nicoposa12/memora`).
5. Render will automatically detect `render.yaml` and configure:
   - **PostgreSQL Database** (`memora-db`)
   - **Web Service** (`memora-backend`) using Docker runtime
6. Set the required sync variables when prompted:
   - `APP_URL`: Leave blank or set to `https://<your-service-name>.onrender.com` once created.
   - `CORS_ALLOWED_ORIGINS`: Your Vercel frontend URL (e.g. `https://memora.vercel.app` or comma-separated domains).
7. Click **Apply**. Render will provision the database and build the container image.

---

### Option B: Manual Setup on Render

#### Step 1: Create the PostgreSQL Database
1. In Render Dashboard, click **New +** > **PostgreSQL**.
2. Set:
   - **Name**: `memora-db`
   - **Database**: `memora`
   - **User**: `memora_user`
   - **Region**: Choose closest to your target audience (e.g. `Singapore` or `Oregon`)
   - **Plan**: `Free` (or Starter for persistent production)
3. Click **Create Database**.
4. Once created, copy the **Internal Database URL** (for services inside Render) or **External Database URL**.

#### Step 2: Create the Laravel Web Service
1. In Render Dashboard, click **New +** > **Web Service**.
2. Connect your GitHub repository.
3. Configure the service settings:
   - **Name**: `memora-backend`
   - **Region**: Same region as your database
   - **Root Directory**: `backend`
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `Dockerfile`
   - **Docker Context**: `.`
   - **Instance Type**: `Free` (or Starter)
   - **Health Check Path**: `/up`

4. Scroll down to **Environment Variables** and add the following:

| Key | Recommended Value | Notes |
|---|---|---|
| `APP_NAME` | `Memora` | Application Name |
| `APP_ENV` | `production` | Production environment |
| `APP_DEBUG` | `false` | Disable debug stack traces |
| `APP_KEY` | *(Generate using `php artisan key:generate --show`)* | 32-char base64 encryption key |
| `APP_URL` | `https://memora-backend.onrender.com` | Your Render web service URL |
| `DB_CONNECTION` | `pgsql` | PostgreSQL database connection |
| `DATABASE_URL` | *(Paste Internal Database URL from Step 1)* | Automatically configures host, port, user, pass |
| `DB_SSLMODE` | `require` | Required for secure database connections |
| `RUN_MIGRATIONS` | `true` | Runs pending migrations on startup |
| `FILESYSTEM_DISK` | `public` | Set to `public` (or `r2`/`s3` for cloud storage) |
| `SESSION_DRIVER` | `database` | Stores user sessions securely in database |
| `CACHE_STORE` | `database` | Caches rate limits and queries in database |
| `QUEUE_CONNECTION` | `sync` | Synchronous queue processing |
| `LOG_CHANNEL` | `stderr` | Streams application logs directly to Render log viewer |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,https://your-frontend.vercel.app` | Comma-separated list of allowed origins |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | `your_r2_access_key` | Cloudflare R2 S3 Access Key |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | `your_r2_secret_key` | Cloudflare R2 S3 Secret Key |
| `CLOUDFLARE_R2_BUCKET` | `your_bucket_name` | Name of your R2 bucket |
| `CLOUDFLARE_R2_ENDPOINT` | `https://<id>.r2.cloudflarestorage.com` | R2 S3 API Endpoint |
| `CLOUDFLARE_R2_URL` | `https://pub-<id>.r2.dev` | Public Development URL or custom CDN domain |
| `CLOUDFLARE_R2_REGION` | `auto` | Auto region for R2 |

5. Click **Create Web Service**.
6. When the build completes and health check passes, your API will be live at:
   `https://<your-backend-subdomain>.onrender.com/api`

---

## 2. Frontend Deployment on Vercel

1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** > **Project**.
3. Import your GitHub repository (`nicoposa12/memora`).
4. In the **Configure Project** screen:
   - **Project Name**: `memora-frontend` (or your choice)
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click **Edit** and select **`frontend`** (Crucial: do not leave as repository root)
5. Expand the **Environment Variables** section and add:

| Key | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `https://<your-backend-subdomain>.onrender.com/api` | Points to your Render backend API |

6. Click **Deploy**.
7. Vercel will install dependencies, build the Next.js production bundle, and provide your live URL (e.g. `https://memora-frontend.vercel.app`).

---

## 3. Post-Deployment Coordination

Once both services are active:
1. **Update Render CORS**:
   - Go to your `memora-backend` service in Render.
   - Under **Environment**, update `CORS_ALLOWED_ORIGINS` to include your production Vercel URL (e.g. `https://memora-frontend.vercel.app`).
   - If using custom domains (e.g. `https://memora.app`), include them as well:
     `https://memora-frontend.vercel.app,https://memora.app`
2. **Update Render APP_URL**:
   - Ensure `APP_URL` in Render matches your backend service URL (`https://memora-backend.onrender.com`).

---

## 4. Production Testing Checklist

- [ ] **Health Check**: Open `https://<backend-url>/up` in your browser. It should return a successful HTTP 200 response.
- [ ] **Registration & Login**: Sign up for a new account on the Vercel frontend. Confirm JWT authentication token is issued and stored.
- [ ] **Dashboard Access**: Access the dashboard and verify event listing and analytics cards load data without CORS errors.
- [ ] **Photobooth Capture**: Launch the live photobooth (`/photobooth` or `/booth`), grant camera permissions, snap photos, apply a template/filter, and click save.
- [ ] **Event Gallery**: Open the guest gallery (`/e/[slug]/gallery`) to confirm images load properly with HTTPS URLs.
- [ ] **QR Pass Studio**: Generate a QR code pass in QR Studio and verify it scans and resolves.
