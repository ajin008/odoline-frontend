const rawEnv = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
};

function validateEnv(env: typeof rawEnv) {
  const missing: string[] = [];

  if (!env.apiUrl) missing.push("NEXT_PUBLIC_API_URL");

  if (missing.length > 0) {
    throw new Error(
      ` Missing required environment variable(s): ${missing.join(", ")}. ` +
        `Check your .env.local file.`
    );
  }

  // After the check, we KNOW these are defined — assert the clean type.
  return {
    apiUrl: env.apiUrl as string,
  };
}

export const env = validateEnv(rawEnv);
