import { cookieName, localStorageName } from '@/data/constants';
import { fetchCountryData } from '@/services/api/geo';
import { CountryData, CountryDataOptions } from '@/types/bodies/response';
import { getCookie, setCookie } from '@/utilities/helpers/cookie';
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from '@/utilities/helpers/storage';
import { getExpiry } from '@/utilities/helpers/time';
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
  }, []);

  return { data, loading };
};
