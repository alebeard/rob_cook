import { neon } from '@netlify/neon';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

// Create database connection lazily to avoid crashes during import
export function createDb() {
    const dbUrl = process.env.NETLIFY_DATABASE_URL;
    if (!dbUrl) {
        throw new Error('NETLIFY_DATABASE_URL environment variable is not set');
    }
    
    return drizzle({
        schema,
        client: neon(dbUrl)
    });
}

// For backward compatibility, but use createDb() in functions
let _db: ReturnType<typeof createDb> | null = null;
export const db = {
    get instance() {
        if (!_db) {
            _db = createDb();
        }
        return _db;
    }
};