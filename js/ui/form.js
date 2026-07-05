function getValue(id) {
  const element = document.getElementById(id);
  return element ? element.value.trim() : "";
}

function showCertificateSection() {
  const selectedType = DOM.certificateType.value;

  DOM.formSections.forEach((section) => {
    section.classList.add("is-hidden");
  });

  if (!selectedType) return;

  const targetSection = document.getElementById(`bloco_${selectedType}`);

  if (targetSection) {
    targetSection.classList.remove("is-hidden");
  }

  if (selectedType === "registro_imovel" && DOM.propertyItems.children.length === 0) {
    addPropertyItem();
  }
}

function showPersonBlock(prefix, personType) {
  document.getElementById(`${prefix}_pf`).classList.add("is-hidden");
  document.getElementById(`${prefix}_pj`).classList.add("is-hidden");

  if (!personType) return;

  document.getElementById(`${prefix}_${personType}`).classList.remove("is-hidden");
}

function showCivilBlock() {
  const selectedType = DOM.civilType.value;

  DOM.civilBlocks.forEach((block) => {
    block.classList.add("is-hidden");
  });

  if (!selectedType) return;

  document.getElementById(`civil_${selectedType}`).classList.remove("is-hidden");
}

function addPropertyItem() {
  const itemNumber = DOM.propertyItems.querySelectorAll(".item-imovel").length + 1;

  const item = document.createElement("div");
  item.className = "item item-imovel";

  item.innerHTML = `
    <div class="item-header">
      <h3 class="item-title">Certidão ${itemNumber}</h3>
      <button class="remove-item-button" type="button" aria-label="Remover certidão">×</button>
    </div>

    <div class="form-group">
      <label>Tipo da certidão *</label>
      <select class="imovelTipo">
        <option value="">Selecione</option>
        <option value="matricula">Matrícula</option>
        <option value="transcricao">Transcrição</option>
        <option value="onus">Ônus</option>
      </select>
    </div>

    <div class="form-group boxOnusTipo is-hidden">
      <label>Ônus de *</label>
      <select class="onusTipo">
        <option value="">Selecione</option>
        <option value="matricula">Matrícula</option>
        <option value="transcricao">Transcrição</option>
      </select>
    </div>

    <div class="form-group">
      <label>Número *</label>
      <input class="imovelNumero" data-only-numbers placeholder="Somente números">
    </div>

    <div class="form-group boxIncluirOnus is-hidden">
      <label>Incluir ônus? *</label>
      <select class="incluirOnus">
        <option value="">Selecione</option>
        <option value="SIM">SIM</option>
        <option value="NÃO">NÃO</option>
      </select>
    </div>
  `;

  DOM.propertyItems.appendChild(item);
}

function removePropertyItem(button) {
  const item = button.closest(".item-imovel");

  if (!item) return;

  item.remove();
  renumberPropertyItems();
}

function getPropertyCertificateName(type) {
  const names = {
    matricula: "Matrícula",
    transcricao: "Transcrição",
    onus: "Ônus"
  };

  return names[type] || "";
}

function renumberPropertyItems() {
  DOM.propertyItems.querySelectorAll(".item-imovel").forEach((item, index) => {
    const type = item.querySelector(".imovelTipo").value;
    const typeName = getPropertyCertificateName(type);
    const title = item.querySelector(".item-title");

    title.textContent = typeName
      ? `Certidão ${index + 1} — ${typeName}`
      : `Certidão ${index + 1}`;
  });
}

function updatePropertyItem(select) {
  const item = select.closest(".item-imovel");
  const type = select.value;

  const onusTypeBox = item.querySelector(".boxOnusTipo");
  const includeOnusBox = item.querySelector(".boxIncluirOnus");
  const onusTypeSelect = item.querySelector(".onusTipo");
  const includeOnusSelect = item.querySelector(".incluirOnus");

  onusTypeBox.classList.add("is-hidden");
  includeOnusBox.classList.add("is-hidden");

  onusTypeSelect.value = "";
  includeOnusSelect.value = "";

  if (type === "onus") {
    onusTypeBox.classList.remove("is-hidden");
  }

  if (type === "matricula" || type === "transcricao") {
    includeOnusBox.classList.remove("is-hidden");
  }

  renumberPropertyItems();
}

function buildRequestData() {
  const certificateType = getValue("tipoCertidao");

  const request = {
    protocoloMobi: getValue("protocoloMobi"),
    tipoCertidao: certificateType,
    itens: []
  };

  if (certificateType === "combo_internet") {
    request.subtipo = getValue("comboTipoPessoa");

    if (request.subtipo === "pf") {
      request.cpf = getValue("comboCpf");
      request.nome1 = getValue("comboNome");
      request.dataEvento = getValue("comboNascimento");
    }

    if (request.subtipo === "pj") {
      request.cnpj = getValue("comboCnpj");
    }
  }

  if (certificateType === "negativa_iptu") {
    request.indicacaoFiscal = getValue("iptuIndicacaoFiscal");
    request.subtipo = getValue("iptuTipoPessoa");

    if (request.subtipo === "pf") request.cpf = getValue("iptuCpf");
    if (request.subtipo === "pj") request.cnpj = getValue("iptuCnpj");
  }

  if (certificateType === "registro_civil") {
    request.uf = getValue("civilEstado");
    request.cidade = getValue("civilCidade");
    request.cartorio = getValue("civilCartorio");
    request.subtipo = getValue("civilTipo");

    request.livro = getValue("civilLivro");
    request.folha = getValue("civilFolha");
    request.termo = getValue("civilTermo");

    if (request.subtipo === "nascimento") {
      request.nome1 = getValue("civilNascimentoNome");
      request.dataEvento = getValue("civilNascimentoData");
    }

    if (request.subtipo === "casamento") {
      request.nome1 = getValue("civilConjuge1");
      request.nome2 = getValue("civilConjuge2");
      request.dataEvento = getValue("civilCasamentoData");
    }

    if (request.subtipo === "obito") {
      request.nome1 = getValue("civilObitoNome");
      request.dataEvento = getValue("civilObitoData");
    }
  }

  if (certificateType === "registro_imovel") {
    request.itens = Array.from(DOM.propertyItems.querySelectorAll(".item-imovel")).map((item) => {
      const type = item.querySelector(".imovelTipo").value;
      const onusType = item.querySelector(".onusTipo").value;

      return {
        tipoItem: type === "onus" && onusType ? `onus_${onusType}` : type,
        numeroItem: item.querySelector(".imovelNumero").value.trim(),
        incluirOnus: item.querySelector(".incluirOnus").value
      };
    });
  }

  return request;
}

function handleRequestSubmit(event) {
  event.preventDefault();

  const request = buildRequestData();

  console.log("Solicitação montada:", request);
  showToast("Solicitação montada no console do navegador.", "success");
}
