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

function registerFormEvents() {
  DOM.certificateType.addEventListener("change", showCertificateSection);

  DOM.personTypeSelects.forEach((select) => {
    select.addEventListener("change", () => {
      showPersonBlock(select.dataset.personType, select.value);
    });
  });

  DOM.civilType.addEventListener("change", showCivilBlock);

  DOM.addPropertyItemButton.addEventListener("click", addPropertyItem);
}