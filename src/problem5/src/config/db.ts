import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database | null = null;
let initPromise: Promise<Database> | null = null;

export async function initDatabase(): Promise<Database> {
    if (db) return db;
    if (initPromise) return initPromise;

    const DB_PATH =
        process.env.DB_PATH ||
        path.join(__dirname, '../../database.sqlite');

    initPromise = (async () => {
        db = await open({
            filename: DB_PATH,
            driver: sqlite3.Database,
        });

        await db.exec(`
            CREATE TABLE IF NOT EXISTS books (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                author TEXT NOT NULL,
                publishedYear INTEGER,
                genre TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        return db;
    })();

    return initPromise;
}

export async function getDb(): Promise<Database> {
    return db ?? await initDatabase();
}

export async function closeDb() {
    if (db) {
        await db.close();
        db = null;
    }
}