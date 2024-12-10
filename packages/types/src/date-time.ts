import { HourSystem } from '@repo/enums';

// Define supported regions and their formats
export type DateRegion = 'US' | 'UK' | 'EU' | 'JP' | 'CN' | 'AUTO';

export interface FormatOptions {
  locale?: string; // en-US | en-GB
  timezone?: string;
  format?: 'numeric' | 'short' | 'long' | 'full';
  hourSystem?: HourSystem;
}

export interface Timer {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
