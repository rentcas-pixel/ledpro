const db = require('../db');

const proposals = [
  {
    slug: 'a0625',
    title: 'A0625',
    location: '',
    description: 'LAUKO MODELIS',
    parameters: JSON.stringify({
      groups: [
        {
          name: 'Parametrai',
          items: [
            { label: 'Ekrano dydis (mm)', value: '11.520x6.720x82' },
            { label: 'Ekrano plotas (kv.m.)', value: '77.41' },
            { label: 'Bendras svoris (kg)', value: '2.268' },
            { label: 'Galia vid. (kW)', value: '8.6' },
          ],
        },
        {
          name: 'Diodai',
          items: [
            { label: 'Technologija', value: 'SMD' },
            { label: 'Atstumas tarp pikselių (mm)', value: '6.66' },
            { label: 'Rezoliucija (piks.)', value: '1.728x1.008' },
            { label: 'Ryškumas (Nits)', value: '7.500' },
          ],
        },
        {
          name: 'Matymas',
          items: [
            { label: 'Minimalus žiūrėjimo atstumas (m)', value: '6' },
            { label: 'Matymo kampas', value: '160/80' },
            { label: 'Atnaujinimo dažnis (Hz)', value: '≥ 7.680' },
            { label: 'Pilkumo skalė (Bitai)', value: '16' },
            { label: 'Apsaugos klasė (priekis/galas)', value: 'IP66' },
          ],
        },
        {
          name: 'Įtraukta',
          items: [
            { label: 'Valdantysis kompiuteris', value: 'Ne' },
            { label: 'Atsarginių dalių komplektas', value: 'Taip' },
            { label: 'Valdymo programa', value: 'Piksel V.5.2' },
          ],
        },
      ],
    }),
    value: '104.537',
    garantija: '5 metai',
    certifications: 'Sert. UL CE, ETL, ROHS',
    image_url: '/pagrindinis.png',
    thumbnails: JSON.stringify([
      '/pagrindinis.png',
      '/thumbnails-1.png',
      '/thumbnails-2.png',
    ]),
    pdf_url: '/ledpro-JYSK-A25-2026-03-13.pdf',
  },
  {
    slug: 'jysk-ukmerges-233',
    title: 'JYSK Ukmergė – LED apšvietimas',
    garantija: null,
    certifications: null,
    location: 'Ukmergė, Lietuva',
    description: 'Profesionalus LED apšvietimo projektas JYSK parduotuvės Ukmergės filiale. Šiuolaikinis energiją taupantis sprendimas su ilgaamžiška įranga.',
    parameters: JSON.stringify([
      { label: 'LED šviestuvai', value: '45 vnt.' },
      { label: 'Galingumas', value: '24W / vnt.' },
      { label: 'Spalvinė temperatūra', value: '4000K' },
      { label: 'Garantija', value: '5 metai' }
    ]),
    value: '12 450 €',
    image_url: null,
    thumbnails: JSON.stringify(['/placeholder.svg', '/placeholder.svg']),
    pdf_url: '/ledpro-JYSK-A25-2026-03-13.pdf',
  },
  {
    slug: 'jysk-a25',
    title: 'JYSK A25 – LED modernizacija',
    garantija: null,
    certifications: null,
    location: 'Vilnius, A25 prekybos centras',
    description: 'LED apšvietimo sistemos modernizacija JYSK parduotuvėje A25 prekybos centre.',
    parameters: JSON.stringify([
      { label: 'Plotas', value: '850 m²' },
      { label: 'LED šviestuvai', value: '120 vnt.' },
      { label: 'Energijos taupymas', value: '~60%' }
    ]),
    value: '28 900 €',
    image_url: null,
    thumbnails: JSON.stringify(['/placeholder.svg', '/placeholder.svg']),
    pdf_url: '/ledpro-JYSK-A25-2026-03-13.pdf',
  },
];

const upsert = db.prepare(`
  INSERT INTO proposals (slug, title, location, description, parameters, value, garantija, certifications, image_url, thumbnails, pdf_url)
  VALUES (@slug, @title, @location, @description, @parameters, @value, @garantija, @certifications, @image_url, @thumbnails, @pdf_url)
  ON CONFLICT(slug) DO UPDATE SET
    title = excluded.title,
    location = excluded.location,
    description = excluded.description,
    parameters = excluded.parameters,
    value = excluded.value,
    garantija = excluded.garantija,
    certifications = excluded.certifications,
    image_url = excluded.image_url,
    thumbnails = excluded.thumbnails,
    pdf_url = excluded.pdf_url
`);

for (const p of proposals) {
  upsert.run(p);
  console.log(`Pridėtas pasiūlymas: ${p.slug}`);
}

console.log('Seed baigtas.');
db.close();
