import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple backup to a publicly accessible endpoint
export const createBackup = async () => {
  try {
    const dbPath = path.resolve(__dirname, '../../data/muncglobal.db');
    const backupDir = path.resolve(__dirname, '../../public/backups');
    
    // Ensure backup directory exists
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `muncglobal-backup-${timestamp}.db`);
    
    // Copy database file
    fs.copyFileSync(dbPath, backupPath);
    
    console.log(`Database backup created: ${backupPath}`);
    return backupPath;
  } catch (error) {
    console.error('Backup failed:', error);
    throw error;
  }
};

// Auto-backup on server start
export const scheduleBackup = () => {
  // Create backup every 24 hours
  setInterval(createBackup, 24 * 60 * 60 * 1000);
  
  // Create initial backup
  setTimeout(createBackup, 5000);
};
