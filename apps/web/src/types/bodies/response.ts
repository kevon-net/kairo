export interface IpData {
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

export interface CountryData {
  flags?: {
    png: string;
    svg: string;
    alt: string;
  };
  name?: {
    common: string;
    official: string;
  };
  cca2?: string;
  idd: {
    root: string;
    suffixes: string[];
  };
  region?: string;
  subregion?: string;
  timezones?: string[];

  currencies?: {
    KES: {
      name: string;
      symbol: string;
    };
  };
  languages?: {
    eng: string;
    swa: string;
  };
}

export interface CountryDataOptions {
  name?: boolean;
  cca2?: boolean;
  currencies?: boolean;
  idd?: boolean;
  region?: boolean;
  subregion?: boolean;
  languages?: boolean;
  timezones?: boolean;
  flags?: boolean;
}
