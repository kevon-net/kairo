import { geoDataUrl } from "@/data/constants";
import { IpInfo } from "@/types/ipInfo";

export const getGeoData = async (): Promise<IpInfo> => {
	try {
		const getGeoData = await fetch(geoDataUrl);

		const geoData = await getGeoData.json();

		return geoData;
	} catch (error) {
		console.error("---> service error - (get geolocation data):", error);
		throw error;
	}
};
