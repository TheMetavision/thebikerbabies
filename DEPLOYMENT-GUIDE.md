# The Biker Babies — Phase 3 Deployment Guide

## Deploy Steps

```
cd C:\Users\chris\Downloads\bikerbabies-phase3\bb-build
npm install
copy .env.example .env
notepad .env
```

Add Sanity token for project `v518t53u`:
https://www.sanity.io/manage/project/v518t53u → API → Tokens → Add (Editor)

```
npm run migrate
git init
git add .
git commit -m "Phase 3: Full backend - Sanity CMS, Stripe, Printful, AEO/GEO"
git remote add origin https://github.com/TheMetavision/bikerbabies.git
git branch -M main
git push -u origin main
```

Connect to Netlify → import env vars → deploy.

## Key Details

| Field | Value |
|---|---|
| Domain | bikerbabies.com |
| Sanity Project | v518t53u |
| Studio | thebikerbabies.sanity.studio |
| Characters | 28 (18 heroes + 10 villains) |
| Blog | Baby Babble |
| Characters page | Meet The Biker Babies |
| Design | Navy/orange/gold, Bebas Neue + Inter |
| Pages | 6 (Home, Meet The Gang, Media, Merch, Baby Babble, Get In Touch) |
