const configuredApiUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";

export const API_BASE_URL = configuredApiUrl.endsWith("/api")
  ? configuredApiUrl.slice(0, -4)
  : configuredApiUrl;

export const convertUsdToInr = async (amount) => {
  const response = await fetch(
    `${API_BASE_URL}/api/convert/usd-inr?amount=${encodeURIComponent(amount)}`
  );
  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Conversion failed.");
  }

  return payload.data;
};
