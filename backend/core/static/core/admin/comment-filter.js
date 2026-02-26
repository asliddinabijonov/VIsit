document.addEventListener("DOMContentLoaded", () => {
  const viloyatField = document.getElementById("id_viloyat");
  if (!viloyatField) {
    return;
  }

  const relatedUrl = viloyatField.getAttribute("data-related-url");
  if (!relatedUrl) {
    return;
  }

  const targets = [
    "restoran",
    "mehmonxona",
    "transport",
    "gid",
    "tarixiy_obida",
  ];

  const updateSelect = (select, items) => {
    const currentValue = select.value;
    while (select.options.length) {
      select.remove(0);
    }
    const emptyOption = new Option("---------", "");
    select.add(emptyOption);
    items.forEach((item) => {
      const opt = new Option(item.label, item.id);
      select.add(opt);
    });
    if (currentValue) {
      select.value = currentValue;
    }
  };

  const loadRelated = () => {
    const viloyatId = viloyatField.value;
    targets.forEach((name) => {
      const field = document.getElementById(`id_${name}`);
      if (field) {
        updateSelect(field, []);
      }
    });
    if (!viloyatId) {
      return;
    }
    const url = `${relatedUrl}?viloyat_id=${encodeURIComponent(viloyatId)}`;
    fetch(url, { credentials: "same-origin" })
      .then((resp) => resp.json())
      .then((data) => {
        targets.forEach((name) => {
          const field = document.getElementById(`id_${name}`);
          if (field) {
            updateSelect(field, data[name] || []);
          }
        });
      })
      .catch(() => {
        // Leave empty if fetch fails
      });
  };

  viloyatField.addEventListener("change", loadRelated);

  const clearOthers = (activeName) => {
    targets.forEach((name) => {
      if (name === activeName) {
        return;
      }
      const field = document.getElementById(`id_${name}`);
      if (field) {
        field.value = "";
      }
    });
  };

  targets.forEach((name) => {
    const field = document.getElementById(`id_${name}`);
    if (!field) {
      return;
    }
    field.addEventListener("change", () => {
      if (field.value) {
        clearOthers(name);
      }
    });
  });
  loadRelated();
});
