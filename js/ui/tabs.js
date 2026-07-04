function showTab(panelId) {
  DOM.tabButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === panelId);
  });

  DOM.tabPanels.forEach((panel) => {
    panel.classList.toggle("is-hidden", panel.id !== panelId);
  });
}
