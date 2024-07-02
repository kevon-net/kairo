import { signIn } from "@/auth";

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json();

		// trigger auth operation
		await signIn("credentials", { email, password });

		return Response.json({ email, password });
	} catch (error) {
		console.error("x-> Error signing in:", (error as Error).message);
		return Response.error();
	}
}
