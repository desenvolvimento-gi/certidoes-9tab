let DOM = {};

function initializeDOM() {
  DOM = {
    loginSection: document.getElementById("login-section"),
    deniedSection: document.getElementById("denied-section"),
    authenticatedSection: document.getElementById("authenticated-section"),

    googleSignInButton: document.getElementById("google-signin-button"),
    loginStatus: document.getElementById("login-status"),
    deniedMessage: document.getElementById("denied-message"),
    userInfo: document.getElementById("user-info"),
    userStats: document.getElementById("user-stats"),
    userStatRequested: document.getElementById("user-stat-requested"),
    userStatIssued: document.getElementById("user-stat-issued"),

    tabButtons: document.querySelectorAll(".tab-button"),
    tabPanels: document.querySelectorAll(".tab-panel"),

    requestForm: document.getElementById("request-form"),
    certificateType: document.getElementById("tipoCertidao"),
    formSections: document.querySelectorAll(".form-block"),
    personTypeSelects: document.querySelectorAll("[data-person-type]"),
    civilType: document.getElementById("civilTipo"),
    civilBlocks: document.querySelectorAll(".civil-block"),
    propertyItems: document.getElementById("itensImovel"),
    addPropertyItemButton: document.getElementById("add-property-item-button"),

    refreshRequestsButton: document.getElementById("refresh-requests-button"),
    queryStatus: document.getElementById("query-status"),
    requestsList: document.getElementById("requests-list")
  };
}
