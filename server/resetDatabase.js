import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqlite = sqlite3.verbose();

// Connect to the database
const db = new sqlite.Database(path.join(__dirname, 'data', 'muncglobal.db'), (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the database.');
});

// Delete all data from the registrations table
db.run('DELETE FROM registrations', function(err) {
  if (err) {
    console.error('Error deleting registrations:', err.message);
  } else {
    console.log(`Deleted ${this.changes} registrations from the database.`);
  }
  
  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
});
