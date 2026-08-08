const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const isVercel = process.env.VERCEL || process.env.NOW_BUILDER;
let dbPath;

if (isVercel) {
  dbPath = '/tmp/database.sqlite';
  const srcPath = path.resolve(__dirname, 'database.sqlite');
  if (!fs.existsSync(dbPath)) {
    try {
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, dbPath);
        
        // Also copy seed uploads to /tmp/uploads
        const uploadsSrc = path.resolve(__dirname, 'uploads');
        const uploadsDest = '/tmp/uploads';
        if (!fs.existsSync(uploadsDest)) {
          fs.mkdirSync(uploadsDest, { recursive: true });
        }
        if (fs.existsSync(uploadsSrc)) {
          const files = fs.readdirSync(uploadsSrc);
          for (const file of files) {
            const srcFile = path.join(uploadsSrc, file);
            const destFile = path.join(uploadsDest, file);
            if (!fs.existsSync(destFile)) {
              fs.copyFileSync(srcFile, destFile);
            }
          }
        }
        console.log('Database and uploads successfully copied to /tmp.');
      } else {
        console.error('Source database not found at:', srcPath);
      }
    } catch (err) {
      console.error('Failed to copy database or uploads to /tmp:', err);
    }
  }
} else {
  dbPath = path.resolve(__dirname, 'database.sqlite');
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to SQLite database:', err);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Helper functions to wrap sqlite3 methods in Promises
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

module.exports = {
  db,
  query,
  get,
  run
};
