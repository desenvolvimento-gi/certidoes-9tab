function showLogin() {
  DOM.loginSection.classList.remove("is-hidden");
  DOM.deniedSection.classList.add("is-hidden");
  DOM.authenticatedSection.classList.add("is-hidden");
}

function showDenied(user) {
  DOM.loginSection.classList.add("is-hidden");
  DOM.deniedSection.classList.remove("is-hidden");
  DOM.authenticatedSection.classList.add("is-hidden");

  if (DOM.deniedMessage) {
    const email = user && user.email ? ` E-mail identificado: ${user.email}.` : "";
    DOM.deniedMessage.textContent =
      `Seu usuário não possui permissão para acessar este formulário.${email}`;
  }
}

function showAuthenticated(user) {
  DOM.loginSection.classList.add("is-hidden");
  DOM.deniedSection.classList.add("is-hidden");
  DOM.authenticatedSection.classList.remove("is-hidden");

  DOM.userInfo.textContent = `Bem-vindo, ${user.name} (${user.email})`;
}
