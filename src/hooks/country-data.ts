import { COOKIE_NAME, LOCAL_STORAGE_NAME, WEEK } from '@/data/constants';
import { fetchCountryData } from '@/services/api/geo';
import { CountryData, CountryDataOptions } from '@/types/bodies/response';
import {
  getCookieClient,
  setCookieClient,
} from '@/utilities/helpers/cookie-client';
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from '@/utilities/helpers/storage';
import { useThrottledCallback } from '@mantine/hooks';
import { useEffect, useState } from 'react';

export const useCountryData = (
  countryName?: string,
  options?: CountryDataOptions
) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CountryData[]>([]);

  const countriesDataInLocalStorage = getCookieClient(
    !countryName ? COOKIE_NAME.LOCAL.COUNTRIES : COOKIE_NAME.LOCAL.COUNTRY
  );

  const getData = async () => {
    setLoading(true);

    if (!countriesDataInLocalStorage) {
      const countryData = await fetchCountryData(countryName, options);

      saveToLocalStorage(
        !countryName
          ? LOCAL_STORAGE_NAME.COUNTRIES
          : LOCAL_STORAGE_NAME.COUNTRY,
        countryData
      );

      setCookieClient(
        !countryName ? COOKIE_NAME.LOCAL.COUNTRIES : COOKIE_NAME.LOCAL.COUNTRY,
        true,
        {
          expiryInSeconds: WEEK,
        }
      );

      setData(countryData);
    }

    const countryData = await getFromLocalStorage(LOCAL_STORAGE_NAME.COUNTRIES);

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
