import { drizzle } from 'drizzle-orm/node-postgres';
import { pool } from '../config/pool';
import * as schema from './schema';

export const db = drizzle(pool, { schema });

export type Database = typeof db;

