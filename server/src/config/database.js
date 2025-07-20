import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get current file directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database directory and file path
const dbDir = path.resolve(__dirname, '../../data');
const dbPath = path.resolve(dbDir, 'muncglobal.db');

// Ensure the data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create and initialize the database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    return;
  }
  console.log('Connected to SQLite database');
  
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');
  
  // Initialize database tables
  initDatabase();
});

// Initialize database tables
const initDatabase = () => {
  // Create registrations table
  db.run(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      registration_code TEXT UNIQUE NOT NULL,
      first_name TEXT NOT NULL,
      middle_name TEXT,
      surname TEXT NOT NULL,
      date_of_birth TEXT NOT NULL,
      gender TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      postal_address TEXT NOT NULL,
      email TEXT NOT NULL,
      institution TEXT NOT NULL,
      program_of_study TEXT NOT NULL,
      educational_level TEXT NOT NULL,
      nationality TEXT NOT NULL,
      city TEXT NOT NULL,
      committee_preference TEXT NOT NULL,
      emergency_contact_name TEXT NOT NULL,
      emergency_contact_number TEXT NOT NULL,
      emergency_contact_relationship TEXT NOT NULL,
      special_needs TEXT,
      special_needs_details TEXT,
      previous_mun_experience TEXT NOT NULL,
      how_heard TEXT NOT NULL,
      how_heard_other TEXT,
      payment_status TEXT DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create payments table
  db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      registration_id INTEGER NOT NULL,
      transaction_id TEXT UNIQUE NOT NULL,
      amount REAL NOT NULL,
      status TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      currency TEXT DEFAULT 'GHS',
      payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (registration_id) REFERENCES registrations(id)
    )
  `);
  
  // Create payment_initializations table
  db.run(`
    CREATE TABLE IF NOT EXISTS payment_initializations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      registration_code TEXT NOT NULL,
      email TEXT NOT NULL,
      amount REAL NOT NULL,
      reference TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database tables initialized');
};

// Helper function to run queries with promises
const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

// Helper function to get data with promises
const getQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
};

// Helper function to get all rows with promises
const getAllQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
};

export { db, runQuery, getQuery, getAllQuery };
