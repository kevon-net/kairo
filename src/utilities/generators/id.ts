import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a UUID for use in a PostgreSQL database.
 * @returns {string} A version 4 UUID.
 */

export function generateUUID(): string {
  return uuidv4();
}
