import { geoDataUrl, headers } from '@/data/constants';
import { Request } from '@/enums/request';
import { GeoInfo } from '@/types/bodies/response';

export const fetchGeoData = async (ip?: string): Promise<GeoInfo> => {
  try {
    const url = `${geoDataUrl}/${ip}/json`;

    const getGeoData = await fetch(url, {
      method: Request.GET,
      headers: headers.withoutBody,
    });

    const geoData = await getGeoData.json();

    return geoData;
  } catch (error) {
    console.error('---> service error (get geolocation data):', error);
    throw error;
  }
};
