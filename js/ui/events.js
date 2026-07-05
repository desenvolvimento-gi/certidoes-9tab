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

  DOM.requestForm.addEventListener("submit", handleRequestSubmit);

  DOM.requestForm.addEventListener("input", (event) => {
    if (event.target.matches("[data-only-numbers]")) {
      applyOnlyNumbersMask(event.target);
    }
  });

  DOM.requestForm.addEventListener("focusout", (event) => {
    if (event.target.matches("input, select")) {
      validateFormField(event.target);
    }
  });

  DOM.propertyItems.addEventListener("change", (event) => {
    if (event.target.matches(".imovelTipo")) {
      updatePropertyItem(event.target);
    }
  });

  DOM.propertyItems.addEventListener("click", (event) => {
    if (event.target.matches(".remove-item-button")) {
      removePropertyItem(event.target);
    }
  });
}

function registerEvents() {
  registerLoginEvents();
  registerTabEvents();
  registerFormEvents();
}
