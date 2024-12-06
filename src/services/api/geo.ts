import { geoDataUrl, headers } from '@/data/constants';
import { Request } from '@/enums/request';
import {
  CountryData,
  CountryDataOptions,
  IpData,
} from '@/types/bodies/response';

export const fetchIp = async (ip?: string): Promise<IpData> => {
  try {
    const urlIp = `${geoDataUrl.ip}/${ip}/json`;

    const getIpData = await fetch(urlIp, {
      method: Request.GET,
      headers: headers.withoutBody,
    });

    const ipData = await getIpData.json();

    return ipData;
  } catch (error) {
    console.error('---> service error (get ip data):', error);
    throw error;
  }
};

export const fetchCountryData = async (
  countryName?: string,
  options: CountryDataOptions = {
    name: true,
    cca2: true,
    currencies: true,
    idd: true,
    region: true,
    subregion: true,
    languages: true,
    timezones: true,
    flags: true,
  }
): Promise<CountryData[]> => {
  try {
    const cca2 = options.cca2 ? 'cca2,' : '';
    const currencies = options.currencies ? 'currencies,' : '';
    const idd = options.idd ? 'idd,' : '';
    const region = options.region ? 'region,' : '';
    const subregion = options.subregion ? 'subregion,' : '';
    const languages = options.languages ? 'languages,' : '';
    const timezones = options.timezones ? 'timezones,' : '';
    const flags = options.flags ? 'flags,' : '';
    const name = options.name ? 'name' : '';

    const queryParams = `fields=${cca2 + currencies + idd + region + subregion + languages + timezones + flags + name}`;

    const country = countryName ? `name/${countryName || 'Kenya'}` : 'all';

    const urlCountry = `${geoDataUrl.countries}/${country}?${queryParams}`;

    console.log('urlCountry', urlCountry);

    const getCountryData = await fetch(urlCountry, {
      method: Request.GET,
      headers: headers.withoutBody,
    });

    console.log('getCountryData.url', getCountryData.url);

    const countryData = await getCountryData.json();

    return countryData;
  } catch (error) {
    console.error('---> service error (get country data):', error);
    throw error;
  }
};
