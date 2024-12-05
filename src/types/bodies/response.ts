export interface GeoInfo {
  ip: string;
  version: string;
  city: string;
  country_name: string;
  country_code: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;

  expires: Date;
  iat: number;
  exp: Date;
}
