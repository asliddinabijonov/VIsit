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
