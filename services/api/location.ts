import { IpInfo } from "@/types/ipInfo";

export const getLocationData = async (): Promise<IpInfo> => {
	try {
		const request = await fetch(`https://ipinfo.io/json?token=${process.env.NEXT_IP_INFO_TOKEN}`);

		const response = await request.json();

		return response;
	} catch (error) {
		console.error("---> service error - (get location data):", error);
		throw error;
	}
};
