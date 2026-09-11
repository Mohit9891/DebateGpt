const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export function getSessionId() {
  let id = localStorage.getItem("debate_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("debate_session_id", id);
  }
  return id;
}

export function getToken() {
  return localStorage.getItem("debate_jwt") || null;
}

export async function api(path, opts = {}) {
  const headers = {
    "Content-Type": "application/json",
    "X-Session-Id": getSessionId(),
    ...(opts.headers || {}),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || "Request failed");
    err.status = res.status;
    err.loginRequired = data.loginRequired === true || res.status === 401;
    throw err;
  }
  return data;
}

export const debatesApi = {
  listPersonalities: () => api("/api/personalities"),
  // Legacy single-shot (stateless) — server builds the system prompt
  legacyChat: ({ messages, topic, stance, personalityId }) =>
    api("/api/debate", {
      method: "POST",
      body: JSON.stringify({ messages, topic, stance, personalityId }),
    }),
  create: ({ topic, openingArgument, stance, personalityId }) =>
    api("/api/debates/create", {
      method: "POST",
      body: JSON.stringify({ topic, openingArgument, stance, personalityId }),
    }),
  list: () => api(`/api/debates?sessionId=${getSessionId()}`),
  get: (id) => api(`/api/debates/${id}`),
  sendMessage: (id, content) =>
    api(`/api/debates/${id}/messages`, { method: "POST", body: JSON.stringify({ content }) }),
  end: (id) => api(`/api/debates/${id}/end`, { method: "POST" }),
  summary: (id) => api(`/api/debates/${id}/summary`),
};

export const feedbackApi = {
  submit: ({ debateId, rating, comment }) =>
    api("/api/feedback", { method: "POST", body: JSON.stringify({ debateId, rating, comment }) }),
};

export const authApi = {
  google: ({ idToken, sessionId }) =>
    api("/api/auth/google", { method: "POST", body: JSON.stringify({ idToken, sessionId: sessionId || getSessionId() }) }),
  me: () => api("/api/auth/me"),
};

export const analyticsApi = {
  get: () => api("/api/analytics"),
};
