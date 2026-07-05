let hasLoadedRequests = false;

function setQueryLoading(isLoading) {
  if (DOM.queryStatus) {
    DOM.queryStatus.textContent = isLoading ? "Carregando solicitações..." : "";
  }

  if (DOM.refreshRequestsButton) {
    DOM.refreshRequestsButton.disabled = isLoading;
    DOM.refreshRequestsButton.textContent = isLoading ? "Atualizando..." : "Atualizar";
  }
}

function renderEmptyRequests() {
  DOM.requestsList.innerHTML = `
    <div class="empty-state">
      <p>Nenhuma solicitação encontrada para o seu e-mail.</p>
    </div>
  `;
}

function renderRequestCard(request) {
  const statusClass = getRequestStatusClass(request.status);

  return `
    <article class="request-card">
      <header class="request-card-header">
        <div>
          <h3>Protocolo ${escapeHtml(request.protocolo || "-")}</h3>
          <p>${escapeHtml(request.tipoCertidao || "-")}</p>
        </div>

        <span class="status-badge ${statusClass}">
          ${escapeHtml(request.status || "SEM STATUS")}
        </span>
      </header>

      <dl class="request-details">
        <div>
          <dt>Qual certidão?</dt>
          <dd>${escapeHtml(request.qualCertidao || "-")}</dd>
        </div>

        <div>
          <dt>Data/hora do pedido</dt>
          <dd>${escapeHtml(request.dataHoraPedido || "-")}</dd>
        </div>

        <div>
          <dt>Número do protocolo</dt>
          <dd>${escapeHtml(request.numeroProtocolo || "-")}</dd>
        </div>

        <div>
          <dt>Número da certidão</dt>
          <dd>${escapeHtml(request.numeroCertidao || "-")}</dd>
        </div>

        <div>
          <dt>Data/hora da emissão</dt>
          <dd>${escapeHtml(request.dataHoraEmissao || "-")}</dd>
        </div>

        <div>
          <dt>Data de validade</dt>
          <dd>${escapeHtml(request.dataValidade || "-")}</dd>
        </div>
      </dl>

      ${
        request.detalhamento
          ? `<section class="request-detailing">
              <h4>Detalhamento</h4>
              <p>${escapeHtml(request.detalhamento)}</p>
            </section>`
          : ""
      }
    </article>
  `;
}

function renderRequests(requests) {
  if (!DOM.requestsList) return;

  if (!requests || requests.length === 0) {
    renderEmptyRequests();
    return;
  }

  DOM.requestsList.innerHTML = requests.map(renderRequestCard).join("");
}

function getRequestStatusClass(status) {
  const normalizedStatus = String(status || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (normalizedStatus.includes("emitida")) return "status-badge--success";
  if (normalizedStatus.includes("erro") || normalizedStatus.includes("cancel")) return "status-badge--danger";
  if (normalizedStatus.includes("andamento") || normalizedStatus.includes("pendente")) return "status-badge--warning";

  return "status-badge--neutral";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function loadUserRequests({ force = false } = {}) {
  if (hasLoadedRequests && !force) return;

  try {
    setQueryLoading(true);

    const result = await listRequests();
    const requests = result.requests || [];

    renderRequests(requests);
    hasLoadedRequests = true;

    if (DOM.queryStatus) {
      DOM.queryStatus.textContent = `${requests.length} solicitação(ões) encontrada(s).`;
    }
  } catch (error) {
    console.error("Erro ao consultar solicitações:", error);

    if (DOM.requestsList) {
      DOM.requestsList.innerHTML = `
        <div class="empty-state empty-state--error">
          <p>${escapeHtml(error.message || "Erro ao consultar solicitações.")}</p>
        </div>
      `;
    }

    showToast(error.message || "Erro ao consultar solicitações.", "error");
  } finally {
    setQueryLoading(false);
  }
}

function resetQueryState() {
  hasLoadedRequests = false;

  if (DOM.requestsList) {
    DOM.requestsList.innerHTML = "";
  }

  if (DOM.queryStatus) {
    DOM.queryStatus.textContent = "";
  }
}
