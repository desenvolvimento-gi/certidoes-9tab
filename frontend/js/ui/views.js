function showLogin() {
  loginSection.classList.remove("is-hidden");
  deniedSection.classList.add("is-hidden");
  dashboardSection.classList.add("is-hidden");
}

function showDenied() {
  loginSection.classList.add("is-hidden");
  deniedSection.classList.remove("is-hidden");
  dashboardSection.classList.add("is-hidden");
}

function showDashboard() {
    loginSection.classList.add("is-hidden");
    dashboardSection.classList.remove("is-hidden");
}