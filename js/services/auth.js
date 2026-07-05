function getGoogleClientId() {
  const clientId = APP_CONFIG.GOOGLE_CLIENT_ID;

  if (!clientId || clientId === "COLE_AQUI_O_CLIENT_ID_DO_GOOGLE") {
    throw new Error("Configure APP_CONFIG.GOOGLE_CLIENT_ID em js/config/constants.js.");
  }

  return clientId;
}

function decodeJwtPayload(token) {
  const [, payload] = token.split(".");

  if (!payload) {
    throw new Error("Token Google inválido.");
  }

  const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(
    atob(normalizedPayload)
      .split("")
      .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
      .join("")
  );

  return JSON.parse(json);
}

function buildUserFromGoogleCredential(credential) {
  const payload = decodeJwtPayload(credential);

  return {
    name: payload.name || payload.email || "Usuário",
    email: (payload.email || "").toLowerCase(),
    picture: payload.picture || ""
  };
}

function isLocallyAuthorized(user) {
  const allowedEmails = APP_CONFIG.AUTHORIZED_EMAILS || [];

  if (allowedEmails.length === 0) {
    return true;
  }

  return allowedEmails
    .map((email) => String(email).trim().toLowerCase())
    .includes(String(user.email).trim().toLowerCase());
}

async function handleGoogleCredentialResponse(response) {
  try {
    if (!response || !response.credential) {
      throw new Error("O Google não retornou uma credencial válida.");
    }

    if (DOM.loginStatus) {
      DOM.loginStatus.textContent = "Verificando autorização...";
    }

    const localUser = buildUserFromGoogleCredential(response.credential);

    const accessResult = await verifyAccess(localUser.email);

    const user = accessResult.user || localUser;

    if (!accessResult.authorized) {
      clearSession();
      showDenied(user);

      if (DOM.loginStatus) {
        DOM.loginStatus.textContent = "";
      }

      return;
    }

    setCurrentUser(user);
    setIdToken(response.credential);

    if (DOM.loginStatus) {
      DOM.loginStatus.textContent = "";
    }

    showAuthenticated(user);
    showTab("request-panel");
  } catch (error) {
    console.error("Erro no login Google:", error);

    clearSession();

    if (DOM.loginStatus) {
      DOM.loginStatus.textContent = error.message || "Erro ao autenticar com Google.";
    }

    showToast(error.message || "Erro ao autenticar com Google.", "error");
  }
}

function initializeGoogleAuth() {
  if (!window.google || !google.accounts || !google.accounts.id) {
    throw new Error("Biblioteca Google Identity Services não carregada.");
  }

  google.accounts.id.initialize({
    client_id: getGoogleClientId(),
    callback: handleGoogleCredentialResponse,
    auto_select: false,
    cancel_on_tap_outside: true
  });

  google.accounts.id.renderButton(DOM.googleSignInButton, {
    theme: "outline",
    size: "large",
    text: "signin_with",
    shape: "rectangular",
    width: 420,
    locale: "pt-BR"
  });
}
