import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs';

let db: Database | null = null;

export async function getDbConnection(): Promise<Database> {
  if (db === null) {
    try {
      // 1. Đọc file database.json từ thư mục gốc
      const configPath = path.resolve(process.cwd(), 'database.json');
      const configRaw = fs.readFileSync(configPath, 'utf-8');
      const config = JSON.parse(configRaw);

      // 2. Lấy đường dẫn file db từ môi trường "dev"
      // Lấy đường dẫn tương đối từ config và chuyển thành đường dẫn tuyệt đối
      const dbPath = path.resolve(process.cwd(), config.dev.filename);

      db = await open({
        filename: dbPath,
        driver: sqlite3.Database
      });

      console.log(`Connected to SQLite: ${config.dev.filename}`);
    } catch (error) {
      console.error('Error connecting to the database:', error);
      throw error;
    }
  }
  return db;
}

export async function closeDbConnection() {
  if (db !== null) {
    try {
      await db.close();
      const currentDb = db;
      db = null; // Gán bằng null trước để tránh loop nếu có lỗi
      console.log('Database connection closed.');
    } catch (error) {
      console.error('Error closing the database connection:', error);
    }
  }
}

// Đăng ký sự kiện đóng kết nối khi tắt app
const handleExit = async () => {
    await closeDbConnection();
    process.exit(0);
};

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
