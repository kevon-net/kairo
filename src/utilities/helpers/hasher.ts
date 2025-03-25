import { Hashing } from '@/enums/algorithm';

// Utility function to convert an ArrayBuffer to a hex string
const arrayBufferToHex = (buffer: ArrayBuffer): string => {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

// Create hashing function
export const hashValue = async (
  rawValue: string | number,
  algorithm: Hashing = Hashing.SHA256 // Default to SHA256
): Promise<string | undefined> => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(rawValue.toString());
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    return arrayBufferToHex(hashBuffer);
  } catch (error) {
    console.error('---> utility error (hash value):', error);
    throw error;
  }
};

// Create hash comparison function
export const compareHashes = async (
  rawValue: string | number,
  hashedValue: string | null,
  algorithm: Hashing = Hashing.SHA256 // Default to SHA256
): Promise<boolean> => {
  try {
    if (!hashedValue) {
      return false;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(rawValue.toString());
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashHex = arrayBufferToHex(hashBuffer);
    return hashHex === hashedValue;
  } catch (error) {
    console.error('---> utility error (compare values):', error);
    throw error;
  }
};
