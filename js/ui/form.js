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

function normalizeSearchText(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function clearAutocomplete(optionsElement, inputElement) {
  optionsElement.innerHTML = "";
  optionsElement.classList.add("is-hidden");
  inputElement.setAttribute("aria-expanded", "false");
}

function showAutocompleteOptions(inputElement, optionsElement, values, onSelect) {
  clearAutocomplete(optionsElement, inputElement);

  const term = normalizeSearchText(inputElement.value);

  if (term.length < 2) {
    return;
  }

  const matches = values
    .filter((value) =>
      normalizeSearchText(value).includes(term)
    )
    .slice(0, 10);

  inputElement._autocompleteIndex = -1;

  if (matches.length === 0) {
    const empty = document.createElement("div");
    empty.className = "autocomplete-empty";
    empty.textContent = "Nenhuma opção encontrada";

    optionsElement.appendChild(empty);
  } else {
    matches.forEach((value) => {
      const option = document.createElement("div");

      option.className = "autocomplete-option";
      option.textContent = value;
      option.dataset.value = value;
      option.setAttribute("role", "option");

      option.addEventListener("mousedown", (event) => {
        event.preventDefault();
        onSelect(value);
      });

      optionsElement.appendChild(option);
    });
  }

  optionsElement.classList.remove("is-hidden");
  inputElement.setAttribute("aria-expanded", "true");
}

function handleAutocompleteKeydown(
  event,
  inputElement,
  optionsElement,
  onSelect
) {
  const options = Array.from(
    optionsElement.querySelectorAll(".autocomplete-option")
  );

  if (options.length === 0) {
    return;
  }

  let index = inputElement._autocompleteIndex ?? -1;

  if (event.key === "ArrowDown") {
    event.preventDefault();

    index = index < options.length - 1
      ? index + 1
      : 0;
  } else if (event.key === "ArrowUp") {
    event.preventDefault();

    index = index > 0
      ? index - 1
      : options.length - 1;
  } else if (event.key === "Enter") {
    event.preventDefault();

    if (index >= 0) {
      onSelect(options[index].dataset.value);
    } else if (options.length > 0) {
      onSelect(options[0].dataset.value);
    }

    return;
  }
  else if (event.key === "Escape") {
    clearAutocomplete(optionsElement, inputElement);
    return;
  } else {
    return;
  }

  inputElement._autocompleteIndex = index;

  options.forEach((option, optionIndex) => {
    option.classList.toggle(
      "is-active",
      optionIndex === index
    );
  });

  options[index].scrollIntoView({
    block: "nearest"
  });
}

function updateCivilCities() {
  const uf = DOM.civilState.value;

  DOM.civilCity.value = "";
  DOM.civilRegistryOffice.value = "";

  clearAutocomplete(
    DOM.civilCityOptions,
    DOM.civilCity
  );

  clearAutocomplete(
    DOM.civilRegistryOfficeOptions,
    DOM.civilRegistryOffice
  );

  DOM.civilRegistryOffice.disabled = true;
  DOM.civilRegistryOffice.placeholder = "Selecione uma cidade primeiro";

  if (!uf) {
    DOM.civilCity.disabled = true;
    DOM.civilCity.placeholder = "Selecione o estado primeiro";
    return;
  }

  DOM.civilCity.disabled = false;
  DOM.civilCity.placeholder = "Digite para pesquisar";
}

function handleCivilCityInput() {
  const uf = DOM.civilState.value;

  DOM.civilRegistryOffice.value = "";
  DOM.civilRegistryOffice.disabled = true;
  DOM.civilRegistryOffice.placeholder = "Selecione uma cidade primeiro";

  clearAutocomplete(
    DOM.civilRegistryOfficeOptions,
    DOM.civilRegistryOffice
  );

  if (!uf) {
    return;
  }

  const cities = getCivilCities(uf);

  showAutocompleteOptions(
    DOM.civilCity,
    DOM.civilCityOptions,
    cities,
    selectCivilCity
  );
}

function selectCivilCity(city) {
  const uf = DOM.civilState.value;

  DOM.civilCity.value = city;
  clearFieldValidationState(DOM.civilCity);

  clearAutocomplete(
    DOM.civilCityOptions,
    DOM.civilCity
  );

  const offices = getCivilRegistryOffices(uf, city);

  DOM.civilRegistryOffice.value = "";

  if (offices.length === 0) {
    DOM.civilRegistryOffice.disabled = true;
    DOM.civilRegistryOffice.placeholder = "Nenhum cartório encontrado";
    return;
  }

  DOM.civilRegistryOffice.disabled = false;
  DOM.civilRegistryOffice.placeholder = "Digite para pesquisar";
}

function handleCivilRegistryOfficeInput() {
  const uf = DOM.civilState.value;
  const city = DOM.civilCity.value.trim();

  if (!uf || !city) {
    return;
  }

  const offices = getCivilRegistryOffices(uf, city);

  showAutocompleteOptions(
    DOM.civilRegistryOffice,
    DOM.civilRegistryOfficeOptions,
    offices,
    selectCivilRegistryOffice
  );
}

function selectCivilRegistryOffice(office) {
  DOM.civilRegistryOffice.value = office;
  clearFieldValidationState(DOM.civilRegistryOffice);

  clearAutocomplete(
    DOM.civilRegistryOfficeOptions,
    DOM.civilRegistryOffice
  );
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
      <label class="checkbox-field">
        <input class="incluirOnus" type="checkbox">
        <span>Emitir também a certidão de ônus</span>
      </label>
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
  const includeOnusCheckbox = item.querySelector(".incluirOnus");

  onusTypeBox.classList.add("is-hidden");
  includeOnusBox.classList.add("is-hidden");

  onusTypeSelect.value = "";
  includeOnusCheckbox.checked = false;

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
    request.tipoCertidao = DOM.comboComplete.checked
      ? "combo_internet_completo"
      : "combo_internet";

    request.subtipo = getValue("comboTipoPessoa");

    if (request.subtipo === "pf") {
      request.cpf = getValue("comboCpf");
      request.nome1 = getValue("comboNome");
      request.dataEvento = getValue("comboNascimento");
    }

    if (request.subtipo === "pj") {
      request.cnpj = getValue("comboCnpj");
      request.nome1 = getValue("comboRazaoSocial");
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
    request.uf = getValue("imovelEstado");
    request.cidade = getValue("imovelCidade");
    request.cartorio = getValue("imovelCartorio");

    request.itens = Array.from(DOM.propertyItems.querySelectorAll(".item-imovel")).map((item) => {
      const type = item.querySelector(".imovelTipo").value;
      const onusType = item.querySelector(".onusTipo").value;

      return {
        tipoItem: type === "onus" && onusType ? `onus_${onusType}` : type,
        numeroItem: item.querySelector(".imovelNumero").value.trim(),
        incluirOnus: item.querySelector(".incluirOnus").checked ? "SIM" : "NÃO"
      };
    });
  }

  return request;
}

function resetRequestForm() {
  DOM.requestForm.reset();
  clearFormValidationState();

  DOM.formSections.forEach((section) => {
    section.classList.add("is-hidden");
  });

  DOM.civilBlocks.forEach((block) => {
    block.classList.add("is-hidden");
  });

  DOM.propertyItems.innerHTML = "";
}

function setSubmitButtonState(isLoading) {
  const submitButton = DOM.requestForm.querySelector('[type="submit"]');

  if (!submitButton) return;

  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? "Enviando..." : "Enviar solicitação";
}

async function handleRequestSubmit(event) {
  event.preventDefault();

  if (isSubmitting()) return;

  clearFormValidationState();

  const request = buildRequestData();
  const validation = validateRequest(request);

  if (!validation.valid) {
    if (validation.fieldId) {
      markFieldAsInvalid(validation.fieldId, validation.message);
      focusField(validation.fieldId);
    }

    showToast(validation.message, "error");
    return;
  }

  try {
    setSubmitting(true);
    setSubmitButtonState(true);

    console.log("Enviando solicitação:", request);

    const result = await submitRequest(request);

    console.log("Resposta da API:", result);
    showToast(result.message || "Solicitação enviada com sucesso.", "success");

    resetRequestForm();
  } catch (error) {
    console.error("Erro ao enviar solicitação:", error);
    showToast(error.message || "Erro ao enviar solicitação.", "error");
  } finally {
    setSubmitting(false);
    setSubmitButtonState(false);
  }
}
