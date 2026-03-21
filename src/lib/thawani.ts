/**
 * Thawani Pay API wrapper
 * Docs: https://docs.thawani.om/
 */

const getConfig = () => {
  const apiKey = process.env.THAWANI_API_KEY;
  const publishableKey = process.env.THAWANI_PUBLISHABLE_KEY;
  const apiUrl = process.env.THAWANI_API_URL || "https://uatcheckout.thawani.om/api/v1";

  return { apiKey, publishableKey, apiUrl };
};

export function isThawaniConfigured(): boolean {
  const { apiKey, publishableKey } = getConfig();
  return !!(apiKey && publishableKey);
}

async function thawaniFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const { apiKey, apiUrl } = getConfig();

  if (!apiKey) {
    throw new Error("THAWANI_API_KEY is not configured");
  }

  const url = `${apiUrl}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "thawani-api-key": apiKey,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "Unknown error");
    throw new Error(`Thawani API error ${response.status}: ${text}`);
  }

  return response.json() as Promise<T>;
}

/* ── Types ── */

export interface ThawaniProduct {
  name: string;
  unit_amount: number; // in baisa (1 OMR = 1000 baisa)
  quantity: number;
}

export interface ThawaniSessionRequest {
  client_reference_id: string;
  mode: "payment";
  products: ThawaniProduct[];
  success_url: string;
  cancel_url: string;
  metadata?: Record<string, string>;
}

export interface ThawaniSession {
  session_id: string;
  client_reference_id: string;
  payment_status: string; // "paid", "unpaid", "cancelled"
  total_amount: number;
  currency: string;
  metadata?: Record<string, string>;
}

interface ThawaniResponse<T> {
  data: T;
  success: boolean;
  code: number;
  description?: string;
}

/* ── API Methods ── */

export async function createCheckoutSession(
  params: ThawaniSessionRequest,
): Promise<ThawaniSession> {
  const result = await thawaniFetch<ThawaniResponse<ThawaniSession>>(
    "/checkout/session",
    {
      method: "POST",
      body: JSON.stringify(params),
    },
  );

  if (!result.success || !result.data?.session_id) {
    throw new Error(`Thawani session creation failed: ${result.description || "Unknown error"}`);
  }

  return result.data;
}

export async function getSession(sessionId: string): Promise<ThawaniSession> {
  const result = await thawaniFetch<ThawaniResponse<ThawaniSession>>(
    `/checkout/session/${sessionId}`,
  );

  return result.data;
}

export async function getSessionByReference(
  clientReferenceId: string,
): Promise<ThawaniSession> {
  const result = await thawaniFetch<ThawaniResponse<ThawaniSession>>(
    `/checkout/reference/${clientReferenceId}`,
  );

  return result.data;
}

/**
 * Build the hosted checkout redirect URL for a given session.
 */
export function getCheckoutUrl(sessionId: string): string {
  const { publishableKey, apiUrl } = getConfig();
  // Strip /api/v1 to get the base checkout domain
  const baseUrl = apiUrl.replace(/\/api\/v1$/, "");
  return `${baseUrl}/pay/${sessionId}?key=${publishableKey}`;
}
