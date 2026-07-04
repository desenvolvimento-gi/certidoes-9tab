async function loadHtmlInto(containerSelector, path) {
  const container = document.querySelector(containerSelector);

  if (!container) {
    throw new Error(`Container não encontrado: ${containerSelector}`);
  }

  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Erro ao carregar ${path}: ${response.status}`);
  }

  container.innerHTML = await response.text();
}

async function loadApplicationViews() {
  await loadHtmlInto("#app-root", "views/app-shell.html");
  await loadHtmlInto("#request-form-container", "views/request-form.html");
}
