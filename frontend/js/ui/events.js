function registerLoginEvents() {
  DOM.googleLoginButton.addEventListener("click", () => {
          const fakeUser = {
              name: "William",
              email: "william@email.com"
          };
          showAuthenticated(fakeUser);
          showTab("request-panel");
      });
}

function registerTabEvents() {
  DOM.tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showTab(button.dataset.tab);
    });
  });
}