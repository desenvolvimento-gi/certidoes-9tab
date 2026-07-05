const STATUS_CONFIG = {
  AGUARDANDO: {
    label: "Aguardando",
    className: "status-badge--warning"
  },

  EMITIDA: {
    label: "Emitida",
    className: "status-badge--success"
  },

  FALHA: {
    label: "Falha",
    className: "status-badge--danger"
  }
};

const DEFAULT_STATUS_CONFIG = {
  label: "Sem status",
  className: "status-badge--neutral"
};

function normalizeStatusKey(status) {
  return String(status || "")
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
}

function getStatusConfig(status) {
  const key = normalizeStatusKey(status);

  if (!key) return DEFAULT_STATUS_CONFIG;

  return STATUS_CONFIG[key] || {
    label: String(status).trim(),
    className: "status-badge--neutral"
  };
}
