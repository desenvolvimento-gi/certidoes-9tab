async function bootstrap() {
  await loadApplicationViews();
  initializeDOM();
  registerEvents();
  showLogin();
}
