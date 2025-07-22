import { neon } from '@netlify/neon';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

export const db = drizzle({
    schema,
    client: neon(process.env.NETLIFY_DATABASE_URL!)
});