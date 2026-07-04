async function loadView(containerId, viewName) {
  const container = document.getElementById(containerId);

  if (!container) {
    throw new Error(`Container não encontrado: ${containerId}`);
  }

  const response = await fetch(`views/${viewName}.html`);

  if (!response.ok) {
    throw new Error(`Erro ao carregar view: ${viewName}`);
  }

  const html = await response.text();
  container.innerHTML = html;
}
