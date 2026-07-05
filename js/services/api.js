function getAppsScriptUrl() {
  const url = APP_CONFIG.APPS_SCRIPT_URL;

  if (!url) {
    throw new Error("Configure APP_CONFIG.APPS_SCRIPT_URL em js/config/constants.js.");
  }

  return url;
}

function buildApiPayload(request) {
  const user = getCurrentUser();
  const idToken = getIdToken();

  if (!user || !idToken) {
    throw new Error("Faça login com Google antes de enviar a solicitação.");
  }

  return {
    idToken,
    userEmail: user.email || "",
    userName: user.name || "",
    clientTimestamp: new Date().toISOString(),
    source: "certidoes-9tab-web",
    request
  };
}

async function submitRequest(request) {
  const payload = buildApiPayload(request);
  const mode = APP_CONFIG.APPS_SCRIPT_FETCH_MODE || "no-cors";

  const response = await fetch(getAppsScriptUrl(), {
    method: "POST",
    mode,
    redirect: "follow",
    headers: {
      // text/plain evita preflight CORS e funciona bem com doPost(e).
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload)
  });

  if (mode === "no-cors") {
    return {
      ok: true,
      message: "Solicitação enviada. Como o modo no-cors está ativo, a resposta do servidor não pode ser lida pelo navegador."
    };
  }

  const result = await response.json();

  if (!response.ok || result.ok === false) {
    throw new Error(result.message || "Erro ao enviar solicitação.");
  }

  return result;
}
