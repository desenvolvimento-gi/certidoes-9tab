function validationSuccess() {
  return {
    valid: true,
    message: "",
    fieldId: ""
  };
}

function validationError(message, fieldId = "") {
  return {
    valid: false,
    message,
    fieldId
  };
}

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function isBlank(value) {
  return String(value || "").trim() === "";
}

function hasDigitCountBetween(value, min, max) {
  const digits = onlyDigits(value);
  return digits.length >= min && digits.length <= max;
}

function cpfValido(cpf) {
  const digits = onlyDigits(cpf);

  if (!/^\d{11}$/.test(digits)) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += Number(digits[i]) * (10 - i);
  }

  let digit1 = 11 - (sum % 11);
  if (digit1 >= 10) digit1 = 0;

  if (digit1 !== Number(digits[9])) return false;

  sum = 0;

  for (let i = 0; i < 10; i++) {
    sum += Number(digits[i]) * (11 - i);
  }

  let digit2 = 11 - (sum % 11);
  if (digit2 >= 10) digit2 = 0;

  return digit2 === Number(digits[10]);
}

function cnpjValido(cnpj) {
  const digits = onlyDigits(cnpj);

  if (!/^\d{14}$/.test(digits)) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum = 0;

  for (let i = 0; i < 12; i++) {
    sum += Number(digits[i]) * weights1[i];
  }

  const digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  if (digit1 !== Number(digits[12])) return false;

  sum = 0;

  for (let i = 0; i < 13; i++) {
    sum += Number(digits[i]) * weights2[i];
  }

  const digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  return digit2 === Number(digits[13]);
}

function isCompleteDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function isFutureDate(value) {
  if (!isCompleteDate(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();

  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return date > today;
}

function validatePastDate(value, fieldId, emptyMessage, futureMessage = "A data informada não pode ser futura.") {
  if (isBlank(value)) return validationError(emptyMessage, fieldId);
  if (!isCompleteDate(value)) return validationError(emptyMessage, fieldId);
  if (isFutureDate(value)) return validationError(futureMessage, fieldId);

  return validationSuccess();
}

function runValidations(validations) {
  for (const validation of validations) {
    if (!validation.valid) return validation;
  }

  return validationSuccess();
}

function validateProtocol(request) {
  if (!hasDigitCountBetween(request.protocoloMobi, 4, 6)) {
    return validationError("Informe um protocolo MOBI com 4 a 6 dígitos.", "protocoloMobi");
  }

  return validationSuccess();
}

function validateCertificateType(request) {
  if (isBlank(request.tipoCertidao)) {
    return validationError("Selecione o tipo de certidão.", "tipoCertidao");
  }

  return validationSuccess();
}

function validateComboInternet(request) {
  if (isBlank(request.subtipo)) {
    return validationError("Selecione pessoa física ou jurídica.", "comboTipoPessoa");
  }

  if (request.subtipo === "pf") {
    if (!cpfValido(request.cpf)) {
      return validationError("Informe um CPF válido.", "comboCpf");
    }

    if (!isBlank(request.dataEvento)) {
      const dateValidation = validatePastDate(
        request.dataEvento,
        "comboNascimento",
        "Preencha a data de nascimento completa."
      );

      if (!dateValidation.valid) return dateValidation;
    }
  }

  if (request.subtipo === "pj" && !cnpjValido(request.cnpj)) {
    return validationError("Informe um CNPJ válido.", "comboCnpj");
  }

  return validationSuccess();
}

function validateIptu(request) {
  if (!hasDigitCountBetween(request.indicacaoFiscal, 8, 12)) {
    return validationError("Informe a indicação fiscal com 8 a 12 dígitos.", "iptuIndicacaoFiscal");
  }

  if (isBlank(request.subtipo)) {
    return validationError("Selecione pessoa física ou jurídica.", "iptuTipoPessoa");
  }

  if (request.subtipo === "pf" && !cpfValido(request.cpf)) {
    return validationError("Informe um CPF válido.", "iptuCpf");
  }

  if (request.subtipo === "pj" && !cnpjValido(request.cnpj)) {
    return validationError("Informe um CNPJ válido.", "iptuCnpj");
  }

  return validationSuccess();
}

function validateCivil(request) {
  if (isBlank(request.uf)) {
    return validationError("Selecione o estado.", "civilEstado");
  }

  if (isBlank(request.cidade)) {
    return validationError("Informe a cidade.", "civilCidade");
  }

  if (isBlank(request.cartorio)) {
    return validationError("Informe o cartório.", "civilCartorio");
  }

  if (isBlank(request.subtipo)) {
    return validationError("Selecione a certidão civil.", "civilTipo");
  }

  if (isBlank(request.nome1)) {
    const fieldBySubtype = {
      nascimento: "civilNascimentoNome",
      casamento: "civilConjuge1",
      obito: "civilObitoNome"
    };

    return validationError("Preencha o nome obrigatório da certidão civil.", fieldBySubtype[request.subtipo]);
  }

  if (request.subtipo === "casamento" && isBlank(request.nome2)) {
    return validationError("Informe o nome do cônjuge 2.", "civilConjuge2");
  }

  const dateFieldBySubtype = {
    nascimento: "civilNascimentoData",
    casamento: "civilCasamentoData",
    obito: "civilObitoData"
  };

  const dateValidation = validatePastDate(
    request.dataEvento,
    dateFieldBySubtype[request.subtipo],
    "Preencha a data completa da certidão civil."
  );

  if (!dateValidation.valid) return dateValidation;

  if (!isBlank(request.livro) && !/^\d+$/.test(request.livro)) {
    return validationError("Livro deve conter apenas números.", "civilLivro");
  }

  if (!isBlank(request.folha) && !/^\d+$/.test(request.folha)) {
    return validationError("Folha deve conter apenas números.", "civilFolha");
  }

  if (!isBlank(request.termo) && !/^\d+$/.test(request.termo)) {
    return validationError("Termo deve conter apenas números.", "civilTermo");
  }

  return validationSuccess();
}

function validatePropertyRegistry(request) {
  if (!request.itens || request.itens.length === 0) {
    return validationError("Adicione pelo menos uma certidão de imóvel.", "add-property-item-button");
  }

  for (let index = 0; index < request.itens.length; index++) {
    const item = request.itens[index];
    const position = index + 1;

    if (isBlank(item.tipoItem)) {
      return validationError(`Selecione o tipo da certidão ${position}.`);
    }

    if (isBlank(item.numeroItem)) {
      return validationError(`Informe o número da certidão ${position}.`);
    }

    if (!/^\d+$/.test(item.numeroItem)) {
      return validationError(`O número da certidão ${position} deve conter apenas dígitos.`);
    }
  }

  return validationSuccess();
}

function validateRequest(request) {
  return runValidations([
    validateProtocol(request),
    validateCertificateType(request),
    request.tipoCertidao === "combo_internet" ? validateComboInternet(request) : validationSuccess(),
    request.tipoCertidao === "negativa_iptu" ? validateIptu(request) : validationSuccess(),
    request.tipoCertidao === "registro_civil" ? validateCivil(request) : validationSuccess(),
    request.tipoCertidao === "registro_imovel" ? validatePropertyRegistry(request) : validationSuccess()
  ]);
}

function getFieldElement(fieldId) {
  return fieldId ? document.getElementById(fieldId) : null;
}

function getFieldContainer(field) {
  return field ? field.closest(".form-group") : null;
}

function clearFieldValidationState(field) {
  const container = getFieldContainer(field);
  if (!container) return;

  container.classList.remove("has-error");

  const existingError = container.querySelector(".field-error");
  if (existingError) existingError.remove();
}

function setFieldValidationState(field, message) {
  const container = getFieldContainer(field);
  if (!container) return;

  clearFieldValidationState(field);

  container.classList.add("has-error");

  const errorElement = document.createElement("p");
  errorElement.className = "field-error";
  errorElement.textContent = message;

  container.appendChild(errorElement);
}

function markFieldAsInvalid(fieldId, message) {
  const field = getFieldElement(fieldId);
  if (!field) return;

  setFieldValidationState(field, message);
}

function focusField(fieldId) {
  const field = getFieldElement(fieldId);

  if (field && typeof field.focus === "function") {
    field.focus();
  }
}

function clearFormValidationState() {
  DOM.requestForm.querySelectorAll(".has-error").forEach((container) => {
    container.classList.remove("has-error");
  });

  DOM.requestForm.querySelectorAll(".field-error").forEach((error) => {
    error.remove();
  });
}

function validateFormField(field) {
  if (!field || !field.id) return validationSuccess();

  clearFieldValidationState(field);

  if (field.id === "protocoloMobi" && !isBlank(field.value) && !hasDigitCountBetween(field.value, 4, 6)) {
    const validation = validationError("O protocolo MOBI deve ter 4 a 6 dígitos.", field.id);
    setFieldValidationState(field, validation.message);
    return validation;
  }

  if (/Cpf$/.test(field.id) && !isBlank(field.value) && !cpfValido(field.value)) {
    const validation = validationError("CPF inválido.", field.id);
    setFieldValidationState(field, validation.message);
    return validation;
  }

  if (/Cnpj$/.test(field.id) && !isBlank(field.value) && !cnpjValido(field.value)) {
    const validation = validationError("CNPJ inválido.", field.id);
    setFieldValidationState(field, validation.message);
    return validation;
  }

  if (field.type === "date" && !isBlank(field.value) && isFutureDate(field.value)) {
    const validation = validationError("A data não pode ser futura.", field.id);
    setFieldValidationState(field, validation.message);
    return validation;
  }

  return validationSuccess();
}
