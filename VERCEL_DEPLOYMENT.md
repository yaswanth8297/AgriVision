# 🚀 AgriVision – Vercel & GitHub Deployment Guide

This guide walks you through deploying **AgriVision** to **Vercel** with continuous deployment via **GitHub**.

---

## 🛠️ Step 1: Create a GitHub Repository

Your local repository is already initialized and committed on the `main` branch.

### Option A: Using GitHub CLI (`gh`) (Fastest)
Run the following command in your terminal:
```bash
gh repo create agrivision-platform --public --source=. --remote=origin --push
```
*(Or use `--private` if you prefer a private repository).*

### Option B: Using GitHub Web Interface
1. Go to [github.com/new](https://github.com/new).
2. Repository name: `agrivision-platform` (or your chosen name).
3. Choose **Public** or **Private**.
4. Leave "Add a README", ".gitignore", and license **unchecked** (we have already created them).
5. Click **Create repository**.
6. Run the following commands in your terminal:
   ```bash
   git remote add origin https://github.com/yaswanth8297/agrivision-platform.git
   git branch -M main
   git push -u origin main
   ```

---

## ⚡ Step 2: Import & Deploy on Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** > **"Project"**.
3. Under **"Import Git Repository"**, find and select **`agrivision-platform`** (or click "Adjust GitHub App Permissions" if it doesn't appear).
4. In the **Configure Project** screen:
   - **Project Name:** `agrivision-platform` (or auto-filled)
   - **Framework Preset:** **Other** (Vercel will auto-detect static files + Serverless Functions)
   - **Root Directory:** `./`
   - **Build & Development Settings:** Leave default (no build step needed)
   - **Environment Variables:** None required
5. Click **Deploy**.

---

## 🌟 Step 3: What Gets Deployed?

- **Frontend App:** The single-page PWA app (`index.html`, 2D/3D visualizers, responsive UI, multi-language engine).
- **Serverless API Routes:**
  - `GET /api/telemetry` & `POST /api/telemetry` (Closed-loop IoT simulation & ESP32 telemetry).
  - `POST /api/auth/login` (Authentication endpoint).
- **Offline PWA Support:** [`sw.js`](file:///c:/Users/yaswa/OneDrive/Documents/AGRIVISIONPROJECT/AGRIVISIONPROJECT/sw.js) and [`manifest.json`](file:///c:/Users/yaswa/OneDrive/Documents/AGRIVISIONPROJECT/AGRIVISIONPROJECT/manifest.json) pre-configured with automatic cache bypassing for `/api/*` endpoints.

---

## 🔄 Automatic Continuous Deployment (CI/CD)

Whenever you push commits to GitHub:
```bash
git add .
git commit -m "Update feature"
git push
```
Vercel will automatically trigger a new deployment and update your live URL instantly.

