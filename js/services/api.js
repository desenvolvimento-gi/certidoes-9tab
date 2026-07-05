function getAppsScriptUrl() {
  const url = APP_CONFIG.APPS_SCRIPT_URL;

  if (!url) {
    throw new Error("Configure APP_CONFIG.APPS_SCRIPT_URL em js/config/constants.js.");
  }

  return url;
}


function verifyAccess(idToken) {
  if (!idToken) {
    return Promise.reject(new Error("Token Google não recebido."));
  }

  return new Promise((resolve, reject) => {
    const callbackName = `handleAccessVerification_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`;

    const script = document.createElement("script");
    const url = new URL(getAppsScriptUrl());

    url.searchParams.set("action", "verifyAccess");
    url.searchParams.set("idToken", idToken);
    url.searchParams.set("callback", callbackName);

    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error("Tempo esgotado ao verificar autorização."));
    }, 15000);

    function cleanup() {
      clearTimeout(timeoutId);
      delete window[callbackName];

      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    }

    window[callbackName] = (result) => {
      cleanup();

      if (!result || result.ok === false) {
        reject(new Error(result?.message || "Erro ao verificar autorização."));
        return;
      }

      resolve(result);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("Não foi possível conectar ao Apps Script para verificar autorização."));
    };

    script.src = url.toString();
    document.body.appendChild(script);
  });
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
