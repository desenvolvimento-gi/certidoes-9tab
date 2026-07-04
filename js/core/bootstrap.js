async function bootstrap() {
  await loadView("app-root", "app-shell");
  await loadView("request-view-container", "request-view");
  await loadView("query-view-container", "query-view");

  initializeDOM();
  registerEvents();

  showLogin();
  showTab("request-panel");
}
