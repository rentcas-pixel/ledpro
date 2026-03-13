const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Home
app.get('/', (req, res) => {
  const proposals = db.prepare('SELECT slug, title, location, value FROM proposals ORDER BY created_at DESC').all();
  res.render('index', { proposals });
});

// Track view event (silent fail on read-only env e.g. Vercel)
function trackEvent(proposalId, req, eventType) {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const stmt = db.prepare(`
      INSERT INTO view_events (proposal_id, ip_address, user_agent, event_type)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(proposalId, ip, userAgent, eventType);
  } catch (_) {}
}

// Proposal page: /proposal/:slug or /process/:slug
function handleProposal(req, res) {
  const { slug } = req.params;
  let proposal = db.prepare('SELECT * FROM proposals WHERE slug = ?').get(slug);
  if (!proposal) {
    proposal = db.prepare('SELECT * FROM proposals WHERE LOWER(slug) = ?').get(slug.toLowerCase());
  }

  if (!proposal) {
    return res.status(404).render('404', { slug });
  }

  // Track view
  trackEvent(proposal.id, req, 'view');

  // Parse parameters – support grouped {groups: [{name, items}]} or flat [{label, value}]
  let parameters = [];
  let paramGroups = [];
  if (proposal.parameters) {
    try {
      const parsed = JSON.parse(proposal.parameters);
      if (parsed.groups && Array.isArray(parsed.groups)) {
        paramGroups = parsed.groups;
      } else if (Array.isArray(parsed)) {
        parameters = parsed;
      } else {
        parameters = [{ label: 'Parametrai', value: String(proposal.parameters) }];
      }
    } catch {
      parameters = [{ label: 'Parametrai', value: proposal.parameters }];
    }
  }

  let thumbnails = [];
  if (proposal.thumbnails) {
    try {
      const parsed = JSON.parse(proposal.thumbnails);
      thumbnails = Array.isArray(parsed) ? parsed : [];
    } catch (_) {}
  }
  if (thumbnails.length === 0 && proposal.image_url) {
    thumbnails = [proposal.image_url];
  }

  res.render('proposal', {
    proposal,
    parameters,
    paramGroups,
    thumbnails,
  });
}

app.get('/proposal/:slug', handleProposal);
app.get('/process/:slug', handleProposal);
app.get('/prekes/:slug', handleProposal);

// Download PDF - track and redirect
function handleDownload(req, res) {
  const { slug } = req.params;
  let proposal = db.prepare('SELECT * FROM proposals WHERE slug = ?').get(slug);
  if (!proposal) {
    proposal = db.prepare('SELECT * FROM proposals WHERE LOWER(slug) = ?').get(slug.toLowerCase());
  }
  if (!proposal) {
    return res.status(404).send('Pasiūlymas nerastas');
  }
  trackEvent(proposal.id, req, 'download_pdf');
  res.redirect(proposal.pdf_url);
}
app.get('/proposal/:slug/download', handleDownload);
app.get('/process/:slug/download', handleDownload);
app.get('/prekes/:slug/download', handleDownload);

// Statistics API (optional - for admin)
app.get('/api/stats/:slug', (req, res) => {
  const { slug } = req.params;
  const proposal = db.prepare('SELECT * FROM proposals WHERE slug = ?').get(slug);

  if (!proposal) {
    return res.status(404).json({ error: 'Pasiūlymas nerastas' });
  }

  const stats = db.prepare(`
    SELECT 
      event_type,
      COUNT(*) as count,
      COUNT(DISTINCT ip_address) as unique_ips
    FROM view_events 
    WHERE proposal_id = ?
    GROUP BY event_type
  `).all(proposal.id);

  const events = db.prepare(`
    SELECT timestamp, ip_address, user_agent, event_type
    FROM view_events 
    WHERE proposal_id = ?
    ORDER BY timestamp DESC
    LIMIT 100
  `).all(proposal.id);

  res.json({
    proposal: { slug: proposal.slug, title: proposal.title },
    stats,
    events,
  });
});

// Stats page (human-readable)
app.get('/stats/:slug', (req, res) => {
  const { slug } = req.params;
  const proposal = db.prepare('SELECT * FROM proposals WHERE slug = ?').get(slug);

  if (!proposal) {
    return res.status(404).render('404', { slug });
  }

  const stats = db.prepare(`
    SELECT event_type, COUNT(*) as count, COUNT(DISTINCT ip_address) as unique_ips
    FROM view_events WHERE proposal_id = ?
    GROUP BY event_type
  `).all(proposal.id);

  const events = db.prepare(`
    SELECT timestamp, ip_address, user_agent, event_type
    FROM view_events WHERE proposal_id = ?
    ORDER BY timestamp DESC LIMIT 50
  `).all(proposal.id);

  res.render('stats', { proposal, stats, events });
});

// Export for Vercel serverless
module.exports = app;

// Local development: start server
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`LedPro serveris: http://localhost:${PORT}`);
    console.log(`A0625: http://localhost:${PORT}/proposal/a0625 arba http://localhost:${PORT}/process/a0625`);
  });
}
