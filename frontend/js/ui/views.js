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

function showAuthenticated(user) {
  DOM.loginSection.classList.add("is-hidden");
  DOM.deniedSection.classList.add("is-hidden");
  DOM.authenticatedSection.classList.remove("is-hidden");
  DOM.userInfo.textContent = `Bem-vindo, ${user.name} (${user.email})`;
}

function showTab(panelId) {
  DOM.tabButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === panelId);
  });

  DOM.tabPanels.forEach((panel) => {
    panel.classList.toggle("is-hidden", panel.id !== panelId);
  });
}