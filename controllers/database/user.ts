import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

import prisma from "@/databases/next";

const user = {
	create: async (userData: {
		select?: Prisma.UserSelect<DefaultArgs> | null | undefined;
		include?: Prisma.UserInclude<DefaultArgs> | null | undefined;
		// data: (Prisma.Without<...> & Prisma.UserUncheckedCreateInput) | (Prisma.Without<...> & Prisma.UserCreateInput);
		data: any;
	}) => {
		try {
			await prisma.user.create(userData);

			console.log("+-> User created");
		} catch (error: any) {
			console.error("x-> Couldn't create user:", error.message);
		}
	},
};

export default user;
