import { supabase } from "./supabase.js";

const BASE = import.meta.env.VITE_API_URL;

async function authFetch(path, options = {}) {
  let { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    const { data: refreshed } = await supabase.auth.refreshSession();
    session = refreshed.session;
  }

  if (!session) throw new Error("No active session");

  return fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
}

export const api = {
  get: (path) => authFetch(path).then((r) => r.json()),
  post: (path, body) => authFetch(path, { method: "POST", body: JSON.stringify(body) }).then((r) => r.json()),
  patch: (path, body) => authFetch(path, { method: "PATCH", body: JSON.stringify(body) }).then((r) => r.json()),
  delete: (path) => authFetch(path, { method: "DELETE" }).then((r) => r.json()),
};
