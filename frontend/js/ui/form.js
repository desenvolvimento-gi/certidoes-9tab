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
      <button class="remove-item-button" type="button">×</button>
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