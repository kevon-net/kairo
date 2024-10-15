// Dynamically set the URL prefix based on the environment
const urlPrefix = process.env.NODE_ENV === "production" ? "https://" : "http://";

export const hostName = process.env.NEXT_PUBLIC_HOST;

export const baseUrl = `${urlPrefix}${hostName}`;
