# LedPro – Pasiūlymų peržiūra

Web sistema komercinių pasiūlymų peržiūrai su unikaliais URL ir statistikos registravimu.

## Lokalus paleidimas

```bash
npm install
npm run seed
npm start
```

Atidarykite http://localhost:3000

## Deploy į Railway

1. Sukurkite paskyrą [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Pasirinkite `rentcas-pixel/ledpro`
4. Railway automatiškai aptiks Node.js ir paleis
5. **Settings** → **Generate Domain** – gausite URL (pvz. `ledpro-production.up.railway.app`)

## Maršrutai

- `/` – pagrindinis (pasiūlymų sąrašas)
- `/proposal/:slug` – pasiūlymo puslapis
- `/process/:slug` – tas pats
- `/prekes/:slug` – tas pats
- `/stats/:slug` – statistikos puslapis
