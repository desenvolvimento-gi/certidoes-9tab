function registerLoginEvents() {
  // O botão de login é renderizado e controlado pelo Google Identity Services.
}

function registerTabEvents() {
  DOM.tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const panelId = button.dataset.tab;

      showTab(panelId);

      if (panelId === "query-panel") {
        loadUserRequests();
      }
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

  DOM.civilState.addEventListener("change", updateCivilCities);

  DOM.civilCity.addEventListener("input", handleCivilCityInput);

  DOM.civilCity.addEventListener("keydown", (event) => {
    handleAutocompleteKeydown(
      event,
      DOM.civilCity,
      DOM.civilCityOptions,
      selectCivilCity
    );
  });

  DOM.civilRegistryOffice.addEventListener(
    "input",
    handleCivilRegistryOfficeInput
  );

  DOM.civilRegistryOffice.addEventListener("keydown", (event) => {
    handleAutocompleteKeydown(
      event,
      DOM.civilRegistryOffice,
      DOM.civilRegistryOfficeOptions,
      selectCivilRegistryOffice
    );
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".autocomplete")) {
      clearAutocomplete(
        DOM.civilCityOptions,
        DOM.civilCity
      );

      clearAutocomplete(
        DOM.civilRegistryOfficeOptions,
        DOM.civilRegistryOffice
      );
    }
  });

  DOM.addPropertyItemButton.addEventListener("click", addPropertyItem);

  DOM.requestForm.addEventListener("submit", handleRequestSubmit);

  if (DOM.refreshRequestsButton) {
    DOM.refreshRequestsButton.addEventListener("click", () => {
      loadUserRequests({ force: true });
    });
  }

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
