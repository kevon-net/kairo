import { cookieName, localStorageName } from '@/data/constants';
import { fetchCountryData } from '@/services/api/geo';
import { CountryData, CountryDataOptions } from '@/types/bodies/response';
import {
  getCookie,
  setCookie,
  getFromLocalStorage,
  saveToLocalStorage,
} from '@repo/utils/helpers';
import { getExpiry } from '@/utilities/time';
import { useThrottledCallback } from '@mantine/hooks';
import { useEffect, useState } from 'react';

export const useCountryData = (
  countryName?: string,
  options?: CountryDataOptions
) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CountryData[]>([]);

  const countriesDataInLocalStorage = getCookie(
    !countryName ? cookieName.local.countries : cookieName.local.country
  );

  const getData = async () => {
    setLoading(true);

    if (!countriesDataInLocalStorage) {
      const countryData = await fetchCountryData(countryName, options);

      saveToLocalStorage(
        !countryName ? localStorageName.countries : localStorageName.country,
        countryData
      );

      setCookie(
        !countryName ? cookieName.local.countries : cookieName.local.country,
        true,
        {
          expiryInSeconds: getExpiry(true).sec,
        }
      );

      setData(countryData);
    }

    const countryData = await getFromLocalStorage(localStorageName.countries);

    setData(countryData);

    setLoading(false);
  };

  const getDataThrottled = useThrottledCallback(getData, 5000);

  useEffect(() => {
    getDataThrottled();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading };
};
