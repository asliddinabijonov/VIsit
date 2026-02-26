import { demoData } from "./data";
import { API_BASE, resolveMediaUrl, slugify } from "./utils";

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

export async function getImagesMap() {
  try {
    const images = await fetchJson(`${API_BASE}/images/`);
    const map = new Map();
    images.forEach((item) => {
      map.set(item.id, item.image);
    });
    return map;
  } catch {
    return new Map();
  }
}

export async function getRegions() {
  try {
    const regions = await fetchJson(`${API_BASE}/viloyatlar/`);
    return regions.map((region) => ({
      ...region,
      slug: slugify(region.name)
    }));
  } catch {
    return demoData.regions.map((region) => ({
      ...region,
      slug: slugify(region.name)
    }));
  }
}

export async function getRegionBySlug(slug) {
  const regions = await getRegions();
  return regions.find((region) => region.slug === slug) || null;
}

export async function getCategoryList(category) {
  const endpointMap = {
    restaurants: "restoranlar",
    hotels: "mehmonxonalar",
    transport: "transportlar",
    sights: "tarixiy-obidalar"
  };

  if (!endpointMap[category]) {
    return [];
  }

  try {
    return await fetchJson(`${API_BASE}/${endpointMap[category]}/`);
  } catch {
    const fallbackMap = {
      restaurants: demoData.restaurants,
      hotels: demoData.hotels,
      transport: demoData.transports,
      sights: demoData.sights
    };
    return fallbackMap[category] || [];
  }
}

export async function getDetail(category, id) {
  const endpointMap = {
    restaurants: "restoranlar",
    hotels: "mehmonxonalar",
    transport: "transportlar",
    sights: "tarixiy-obidalar"
  };

  if (!endpointMap[category]) return null;

  try {
    return await fetchJson(`${API_BASE}/${endpointMap[category]}/${id}/`);
  } catch {
    const fallbackMap = {
      restaurants: demoData.restaurants,
      hotels: demoData.hotels,
      transport: demoData.transports,
      sights: demoData.sights
    };
    return fallbackMap[category].find((item) => String(item.id) === String(id)) || null;
  }
}

export function resolveItemImage(item, imagesMap, fallback) {
  if (!item) return fallback;

  const images = item.images_detail || item.images || [];
  if (Array.isArray(images) && images.length > 0) {
    const entry = images[0];
    if (typeof entry === "string") return resolveMediaUrl(entry);
    if (entry && entry.image) return resolveMediaUrl(entry.image);
  }

  if (typeof item.image === "string") return resolveMediaUrl(item.image);
  if (typeof item.image === "number" && imagesMap?.has(item.image)) {
    return resolveMediaUrl(imagesMap.get(item.image));
  }

  return fallback;
}
