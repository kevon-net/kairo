import { Request as EnumRequest } from "@/types/enums";
import { apiUrl } from "@/data/constants";
import { SessionCreate, SessionGet, SessionUpdate } from "@/types/models/session";

const baseRequestUrl = `${apiUrl}/session`;

export const sessionCreate = async (session: Omit<SessionCreate, "user"> & { userId: string }) => {
	try {
		const request = new Request(baseRequestUrl, {
			method: EnumRequest.POST,
			body: JSON.stringify(session),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (create session):", error);
		throw error;
	}
};

export const sessionUpdate = async (session: SessionUpdate) => {
	try {
		const request = new Request(baseRequestUrl, {
			method: EnumRequest.PUT,
			body: JSON.stringify(session),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (update session):", error);
		throw error;
	}
};

export const sessionDelete = async (token: string) => {
	try {
		const request = new Request(baseRequestUrl, {
			method: EnumRequest.DELETE,
			body: JSON.stringify(token),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (delete session):", error);
		throw error;
	}
};
