const API_BASE = "/api";

async function request(path) {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export function fetchRegions() {
  return request("/viloyatlar/");
}

export function fetchRegionFull(id) {
  return request(`/viloyatlar/${id}/full/`);
}

export async function createUser(payload) {
  const response = await fetch(`${API_BASE}/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Ro'yxatdan o'tishda xatolik yuz berdi.";

    try {
      const data = await response.json();
      const firstError = Object.values(data).flat().find(Boolean);
      if (firstError) {
        message = firstError;
      }
    } catch {
      // Keep the fallback message if the response cannot be parsed.
    }

    throw new Error(message);
  }

  return response.json();
}

function getAuthHeaders(extra = {}) {
  const token = window.localStorage.getItem("visit-access-token");
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function authRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: getAuthHeaders(options.headers || {}),
  });

  if (!response.ok) {
    let message = `API request failed: ${response.status}`;
    try {
      const data = await response.json();
      const firstError = Object.values(data || {}).flat().find(Boolean);
      if (firstError) {
        message = firstError;
      }
    } catch {
      // Keep fallback.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function loginUser(payload) {
  const response = await fetch(`${API_BASE}/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Login failed.";

    try {
      const data = await response.json();
      message = data.detail || data.username?.[0] || data.password?.[0] || message;
    } catch {
      // Keep fallback message.
    }

    throw new Error(message);
  }

  return response.json();
}

export function fetchCurrentUser() {
  return authRequest("/users/me/");
}

export function fetchOwnedResources(resource) {
  return authRequest(`/${resource}/mine/`);
}

export function createOwnedResource(resource, payload) {
  return authRequest(`/${resource}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function deleteOwnedResource(resource, id) {
  return authRequest(`/${resource}/${id}/`, {
    method: "DELETE",
  });
}
