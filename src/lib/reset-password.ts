import crypto from "crypto";

const RESET_TOKEN_TTL_MS = 1000 * 60 * 60; // 1 hour

export function generateResetToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  return { rawToken, tokenHash, expiresAt };
}

export function hashResetToken(rawToken: string) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}
