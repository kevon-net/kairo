import { CreateEmailOptions } from "resend";

export type EmailInquiry = Omit<CreateEmailOptions, "to" | "react"> & { from: { name: string; email: string } };
