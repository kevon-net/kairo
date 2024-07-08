import { signIn } from "@/auth";

export async function POST(req: Request) {
	try {
		const credentials = await req.json();

		const result = await signIn("credentials", { ...credentials, redirect: false });

		return Response.json({
			data: {
				title: "Authenticated",
				message: `You are now signed in`,
			},
			url: result,
		});
	} catch (error) {
		console.error("x-> Error signing in:", (error as Error).message);
		return Response.error();
	}
}
