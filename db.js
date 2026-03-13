const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, 'data');
const dbPath = path.join(dbDir, 'ledpro.db');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);

// Initialize schema
function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS proposals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT,
      parameters TEXT,
      value TEXT NOT NULL,
      image_url TEXT,
      pdf_url TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS view_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      proposal_id INTEGER NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT,
      user_agent TEXT,
      event_type TEXT NOT NULL CHECK(event_type IN ('view', 'download_pdf')),
      FOREIGN KEY (proposal_id) REFERENCES proposals(id)
    );

    CREATE INDEX IF NOT EXISTS idx_view_events_proposal ON view_events(proposal_id);
    CREATE INDEX IF NOT EXISTS idx_view_events_type ON view_events(event_type);
  `);

  // Migration: add optional columns
  try { db.exec('ALTER TABLE proposals ADD COLUMN garantija TEXT'); } catch (_) {}
  try { db.exec('ALTER TABLE proposals ADD COLUMN certifications TEXT'); } catch (_) {}
  try { db.exec('ALTER TABLE proposals ADD COLUMN thumbnails TEXT'); } catch (_) {}
}

initDb();

module.exports = db;
