export const API_URL = import.meta.env.VITE_API_URL;

export async function healthCheck() {
  const res = await fetch(`${API_URL}/actuator/health`);
  if (!res.ok) throw new Error("Backend not reachable");
  return res.json();
}