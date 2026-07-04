let DOM = {};

function initializeDOM() {
  DOM = {
    loginSection: document.getElementById("login-section"),
    deniedSection: document.getElementById("denied-section"),
    authenticatedSection: document.getElementById("authenticated-section"),

    googleLoginButton: document.getElementById("google-login-button"),
    userInfo: document.getElementById("user-info"),

    tabButtons: document.querySelectorAll(".tab-button"),
    tabPanels: document.querySelectorAll(".tab-panel"),

    requestForm: document.getElementById("request-form"),
    certificateType: document.getElementById("tipoCertidao"),
    formSections: document.querySelectorAll(".form-block"),
    personTypeSelects: document.querySelectorAll("[data-person-type]"),
    civilType: document.getElementById("civilTipo"),
    civilBlocks: document.querySelectorAll(".civil-block"),
    propertyItems: document.getElementById("itensImovel"),
    addPropertyItemButton: document.getElementById("add-property-item-button")
  };
}
