import prisma from "@/services/prisma";
import hasher from "@/utilities/hasher";

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json();

		// query database for user
		const userRecord = await prisma.user.findUnique({ where: { email } });

		if (!userRecord) {
			// create user record
			const passwordHash = await hasher.create(password);
			passwordHash && (await createUser({ email, password: passwordHash }));

			// create otp record
			const otp = Math.floor(1000 + Math.random() * 9000);
			const otpHash = await hasher.create(otp.toString());
			otpHash && (await createOtp({ email, otp: otpHash }));

			// email otp

			return Response.json({ user: { exists: false, otp } });
		} else {
			return Response.json({ user: { exists: true } });
		}
	} catch (error) {
		console.error("x-> Error signing up:", (error as Error).message);
		return Response.error();
	}
}

const createUser = async (fields: { email: string; password: string }) => {
	try {
		await prisma.user.create({
			data: { email: fields.email, password: fields.password },
		});
	} catch (error) {
		console.error("x-> Error creating user record:", (error as Error).message);
		throw error;
	}
};

const createOtp = async (fields: { email: string; otp: string }) => {
	const expiry = new Date(Date.now() + 60 * 60 * 1000);

	try {
		await prisma.user.update({
			where: {
				email: fields.email,
			},
			data: {
				otps: {
					create: [{ email: fields.email, otp: fields.otp, expiresAt: expiry }],
				},
			},
		});
	} catch (error) {
		console.error("x-> Error creating otp record:", (error as Error).message);
		throw error;
	}
};
