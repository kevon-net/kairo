import { GEO_DATA_URL, HEADERS } from '@/data/constants';
import { Request } from '@/enums/request';
import { CountryData, CountryDataOptions } from '@/types/bodies/response';

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

    const urlCountry = `${GEO_DATA_URL.COUNTRIES}/${country}?${queryParams}`;

    const getCountryData = await fetch(urlCountry, {
      method: Request.GET,
      headers: HEADERS.WITHOUT_BODY,
    });

    const countryData = await getCountryData.json();

    return countryData;
  } catch (error) {
    console.error('---> service error (get country data):', error);
    throw error;
  }
};
