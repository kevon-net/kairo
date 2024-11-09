export function getClientIp(request: Request) {
	// Array of headers to check for the real IP
	const IP_HEADERS = [
		"x-real-ip",
		"x-forwarded-for",
		"cf-connecting-ip", // Cloudflare
		"x-client-ip",
		"x-forwarded",
		"forwarded-for",
		"forwarded",
		"remote-addr",
	];

	let clientIp: string | null = null;

	// Check each header
	for (const header of IP_HEADERS) {
		const value = request.headers.get(header);
		if (value) {
			// x-forwarded-for can contain multiple IPs, get the first one
			clientIp = value.split(",")[0].trim();
			break;
		}
	}

	// Fallback to the direct connection IP if no proxy headers found
	if (!clientIp) {
		const socketAddr = request.headers.get("host")?.split(":")[0];
		if (socketAddr) {
			clientIp = socketAddr;
		}
	}

	return clientIp;
}

// Example usage in an API route
// app/api/get-ip/route.ts
//
// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
// 	const ip = getClientIp(request);

// 	return NextResponse.json({
// 		ip,
// 		headers: Object.fromEntries(request.headers),
// 	});
// }
