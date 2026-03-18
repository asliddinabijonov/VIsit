export function slugifyRegionName(name = "") {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['`’‘ʻ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getOrbitRegions(regions = []) {
  return regions.map((region, index) => ({
    ...region,
    orbitIndex: index,
  }));
}

export function findRegionBySlug(regions = [], slug) {
  return regions.find((region) => slugifyRegionName(region.name) === slug) || null;
}

export const resolveRegionBySlug = findRegionBySlug;

export function resolveMeta(type, t) {
  const meta = {
    restaurants: {
      title: t("services.restaurantsTitle"),
      description: t("services.restaurantsDescription"),
    },
    hotels: {
      title: t("services.hotelsTitle"),
      description: t("services.hotelsDescription"),
    },
    tours: {
      title: t("services.toursTitle"),
      description: t("services.toursDescription"),
    },
    guides: {
      title: t("services.guidesTitle"),
      description: t("services.guidesDescription"),
    },
  };

  return meta[type] || meta.restaurants;
}

export function normalizeMediaUrl(path = "") {
  if (!path) {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path;
  }

  return `/media/${path}`;
}

export function getVideoUrl(entity) {
  if (!entity) {
    return "";
  }

  if (entity.video_url) {
    return entity.video_url;
  }

  if (entity.video) {
    return normalizeMediaUrl(entity.video);
  }

  return "";
}

export function getPosterUrl(entity) {
  if (!entity?.video_poster) {
    return "";
  }

  return normalizeMediaUrl(entity.video_poster);
}

export function getVideoTypeLabel(videoType, t) {
  if (videoType === "360") {
    return t("detail.video360");
  }

  return t("detail.standardVideo");
}

export function getProjectionLabel(projection, t) {
  if (projection === "equirectangular") {
    return t("detail.equirectangular");
  }

  if (projection === "cubemap") {
    return t("detail.cubemap");
  }

  if (projection === "fisheye") {
    return t("detail.fisheye");
  }

  return t("services.notProvided");
}

export function getStereoModeLabel(mode, t) {
  if (mode === "left_right") {
    return t("detail.leftRight");
  }

  if (mode === "top_bottom") {
    return t("detail.topBottom");
  }

  if (mode === "mono") {
    return t("detail.mono");
  }

  return t("services.notProvided");
}

export function getPrimaryImage(entity) {
  if (!entity) {
    return "";
  }

  if (Array.isArray(entity)) {
    return getPrimaryImage(entity[0]);
  }

  if (entity.image_detail?.image) {
    return normalizeMediaUrl(entity.image_detail.image);
  }

  if (entity.image) {
    return normalizeMediaUrl(entity.image);
  }

  if (Array.isArray(entity.images_detail) && entity.images_detail.length > 0) {
    return normalizeMediaUrl(entity.images_detail[0].image);
  }

  return "";
}

export function getAllImages(entity) {
  if (!entity) {
    return [];
  }

  const urls = [];

  if (entity.image_detail?.image) {
    urls.push(normalizeMediaUrl(entity.image_detail.image));
  }

  if (entity.image) {
    urls.push(normalizeMediaUrl(entity.image));
  }

  if (Array.isArray(entity.images_detail)) {
    entity.images_detail.forEach((entry) => {
      if (entry?.image) {
        urls.push(normalizeMediaUrl(entry.image));
      }
    });
  }

  return [...new Set(urls.filter(Boolean))];
}

export function buildHeroBackground(image) {
  const mediaUrl = normalizeMediaUrl(image);

  if (mediaUrl) {
    return {
      backgroundImage: `linear-gradient(180deg, rgba(5,13,32,.12), rgba(5,13,32,.34)), url("${mediaUrl}")`,
      backgroundPosition: "center",
      backgroundSize: "cover",
    };
  }

  return {
    background:
      "radial-gradient(circle at 50% 30%, rgba(100,160,255,.28), transparent 34%), linear-gradient(180deg, #18345d 0%, #0a1530 55%, #050912 100%)",
  };
}

export function buildCardBackground(image) {
  const mediaUrl = normalizeMediaUrl(image);

  if (mediaUrl) {
    return {
      backgroundImage: `linear-gradient(180deg, rgba(10,17,38,.1), rgba(10,17,38,.62)), url("${mediaUrl}")`,
      backgroundPosition: "center",
      backgroundSize: "cover",
    };
  }

  return {
    background:
      "linear-gradient(180deg, rgba(18,21,35,.14), rgba(18,21,35,.76)), radial-gradient(circle at 55% 15%, rgba(255,214,133,.3), transparent 34%), linear-gradient(135deg, #36507d 0%, #182033 42%, #0a0b12 100%)",
  };
}

export function mapServiceContent(fullRegion, type) {
  if (type === "restaurants") {
    return fullRegion.restoranlar || [];
  }

  if (type === "hotels") {
    return fullRegion.mehmonxonalar || [];
  }

  if (type === "tours") {
    return {
      transports: fullRegion.transportlar || [],
      guides: fullRegion.gidlar || [],
    };
  }

  if (type === "guides") {
    return fullRegion.tarixiy_obidalar || [];
  }

  return [];
}

export function getItemKey(type, item) {
  if (type === "tours") {
    return item.kind === "transport" ? `transport-${item.id}` : `guide-${item.id}`;
  }

  return String(item.id);
}

export function findServiceItem(fullRegion, type, itemKey) {
  if (type === "restaurants") {
    return fullRegion.restoranlar?.find((item) => String(item.id) === itemKey) || null;
  }

  if (type === "hotels") {
    return fullRegion.mehmonxonalar?.find((item) => String(item.id) === itemKey) || null;
  }

  if (type === "guides") {
    return fullRegion.tarixiy_obidalar?.find((item) => String(item.id) === itemKey) || null;
  }

  if (type === "tours") {
    if (itemKey.startsWith("transport-")) {
      const id = itemKey.replace("transport-", "");
      const item = fullRegion.transportlar?.find((entry) => String(entry.id) === id) || null;
      return item ? { ...item, kind: "transport" } : null;
    }

    if (itemKey.startsWith("guide-")) {
      const id = itemKey.replace("guide-", "");
      const item = fullRegion.gidlar?.find((entry) => String(entry.id) === id) || null;
      return item ? { ...item, kind: "guide" } : null;
    }
  }

  return null;
}

export function formatDetailText(value, fallback) {
  return value && String(value).trim() ? value : fallback;
}

export function buildServiceFacts(type, item, t) {
  if (!item) {
    return [];
  }

  if (type === "restaurants" || type === "hotels") {
    return [
      { label: t("services.description"), value: formatDetailText(item.description, t("services.notProvided")) },
      { label: t("services.location"), value: formatDetailText(item.location, t("services.notProvided")) },
      { label: t("services.phone"), value: formatDetailText(item.phone_number, t("services.notProvided")) },
      { label: t("services.email"), value: formatDetailText(item.email, t("services.notProvided")) },
      {
        label: t("services.features"),
        value:
          item.xususiyat_detail?.length > 0
            ? item.xususiyat_detail.map((feature) => feature.turi).join(", ")
            : t("services.notProvided"),
      },
    ];
  }

  if (type === "guides") {
    return [
      { label: t("services.location"), value: formatDetailText(item.location, t("services.notProvided")) },
      { label: t("services.date"), value: formatDetailText(item.date, t("services.notProvided")) },
      { label: t("services.price"), value: item.cost ? String(item.cost) : t("services.notProvided") },
    ];
  }

  if (type === "tours" && item.kind === "transport") {
    return [
      { label: t("services.description"), value: formatDetailText(item.description, t("services.notProvided")) },
      { label: t("services.phone"), value: formatDetailText(item.phone_number, t("services.notProvided")) },
      { label: t("services.email"), value: formatDetailText(item.email, t("services.notProvided")) },
      { label: t("services.date"), value: formatDetailText(item.date, t("services.notProvided")) },
    ];
  }

  if (type === "tours" && item.kind === "guide") {
    return [
      { label: t("services.description"), value: formatDetailText(item.description, t("services.notProvided")) },
      { label: t("services.phone"), value: formatDetailText(item.phone_number, t("services.notProvided")) },
      { label: t("services.language"), value: formatDetailText(item.language, t("services.notProvided")) },
      { label: t("services.country"), value: formatDetailText(item.country, t("services.notProvided")) },
      { label: t("services.birthday"), value: formatDetailText(item.birthday, t("services.notProvided")) },
    ];
  }

  return [];
}

export function buildServiceTitle(type, item, t) {
  if (type === "tours" && item?.kind === "transport") {
    return item.title || t("detail.transportFallback");
  }

  if (type === "tours" && item?.kind === "guide") {
    return item.title || t("detail.guideFallback");
  }

  return item?.title || t("detail.genericFallback");
}
