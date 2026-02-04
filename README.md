# Nexus Portfolio Gallery

This project is ready to deploy on [Render](https://render.com/) as a static site.

## Local development

1. Install dependencies:
   `npm install`
2. Run the dev server:
   `npm run dev`

## Deploy on Render (Git push workflow)

1. Create an empty GitHub repo.
2. From this folder, run:
   ```bash
   git init
   git branch -M main
   git add .
   git commit -m "Prepare for Render deploy"
   git remote add origin <YOUR_GITHUB_REPO_URL>
   git push -u origin main
   ```
3. In Render, click **New +** -> **Blueprint**.
4. Select your GitHub repo and deploy.

Render will use `render.yaml`:
- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- SPA rewrite: `/* -> /index.html`

## Notes

- If you use any runtime/build secrets later, add them in Render under **Environment**.
