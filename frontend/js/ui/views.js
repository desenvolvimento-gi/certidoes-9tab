function showLogin() {
  DOM.loginSection.classList.remove("is-hidden");
  DOM.deniedSection.classList.add("is-hidden");
  DOM.authenticatedSection.classList.add("is-hidden");
}

function showDenied() {
  DOM.loginSection.classList.add("is-hidden");
  DOM.deniedSection.classList.remove("is-hidden");
  DOM.authenticatedSection.classList.add("is-hidden");
}

function showDashboard(user) {
  DOM.loginSection.classList.add("is-hidden");
  DOM.deniedSection.classList.add("is-hidden");
  DOM.authenticatedSection.classList.remove("is-hidden");

  DOM.userInfo.textContent = `Bem-vindo, ${user.name} (${user.email})`;
}