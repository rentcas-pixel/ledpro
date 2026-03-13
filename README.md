# LedPro – Pasiūlymų peržiūros sistema

Web sistema komerciniams pasiūlymams rodyti su unikaliais URL ir peržiūrų statistika.

## Paleisti

```bash
npm install
npm run seed    # Prideda pavyzdinius pasiūlymus
npm start
```

Atidarykite: http://localhost:3000

## Struktūra

| URL | Aprašymas |
|-----|-----------|
| `/` | Pasiūlymų sąrašas |
| `/proposal/:slug` | Pasiūlymo puslapis (pvz. `/proposal/jysk-ukmerges-233`) |
| `/proposal/:slug/download` | PDF atsisiuntimas (registruoja `download_pdf`) |
| `/stats/:slug` | Peržiūrų statistika |
| `/api/stats/:slug` | Statistikos JSON API |

## Statistikos registravimas

Kiekvieną kartą atidarius pasiūlymo puslapį arba spaudžiant „Atsisiųsti PDF“, įrašoma:

- `proposal_id`
- `timestamp`
- `ip_address`
- `user_agent`
- `event_type` (`view` arba `download_pdf`)

## Naujų pasiūlymų pridėjimas

Į `scripts/seed.js` pridėkite objektą į `proposals` masyvą arba įterpkite į SQLite:

```javascript
{
  slug: 'unikalus-slug',
  title: 'Projekto pavadinimas',
  location: 'Vieta',
  description: 'Trumpas aprašymas',
  parameters: JSON.stringify([{ label: 'Param', value: 'Vertė' }]),
  value: '12 450 €',
  image_url: '/kelias/paveiksliukui.jpg',
  pdf_url: '/kelias/pasiulymas.pdf',
}
```

## Duomenų bazė

SQLite failas: `data/ledpro.db`
