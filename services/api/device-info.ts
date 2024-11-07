import { geoDataUrl } from "@/data/constants";
import { IpInfo } from "@/types/ipInfo";

export const getDeviceInfo = async (): Promise<IpInfo> => {
	try {
		const getLocationData = await fetch(geoDataUrl);

		const locationData = await getLocationData.json();

		return locationData;
	} catch (error) {
		console.error("---> service error - (get device info):", error);
		throw error;
	}
};
