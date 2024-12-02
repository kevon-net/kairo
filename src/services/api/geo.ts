'use client';

import { geoDataUrl, headers } from '@/data/constants';
import { Request } from '@/enums/request';
import { IpInfo } from '@/types/bodies/response';

export const getGeoData = async (): Promise<IpInfo> => {
  try {
    const getGeoData = await fetch(geoDataUrl, {
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
