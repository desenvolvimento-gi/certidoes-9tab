const SPREADSHEET_ID = ""; // Se o script não estiver vinculado à planilha, informe o ID aqui.
const SHEET_NAME_REQUESTS = "Solicitações";
const SHEET_NAME_EMAILS = "Emails";

// Sprint 4: enquanto o login Google real não estiver integrado,
// mantenha false para aceitar o e-mail simulado enviado pelo frontend.
// Depois da Sprint de autenticação, trocar para true.
const REQUIRE_AUTHORIZED_EMAIL = false;

function doGet() {
  return jsonResponse({
    ok: true,
    message: "API de Solicitação de Certidões ativa."
  });
}

function doPost(e) {
  try {
    const payload = parsePayload(e);
    const request = payload.request;

    if (!request) {
      throw new Error("Payload inválido: request não encontrado.");
    }

    const email = String(payload.userEmail || "").trim().toLowerCase();

    if (REQUIRE_AUTHORIZED_EMAIL && !usuarioAutorizado(email)) {
      throw new Error("Usuário não autorizado a enviar solicitações.");
    }

    salvarSolicitacao(request, {
      email,
      userName: payload.userName || "",
      clientTimestamp: payload.clientTimestamp || "",
      source: payload.source || ""
    });

    return jsonResponse({
      ok: true,
      message: "Solicitação enviada com sucesso!"
    });
  } catch (error) {
    console.error(error);

    return jsonResponse({
      ok: false,
      message: error.message || "Erro inesperado ao salvar solicitação."
    });
  }
}

function parsePayload(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("Nenhum dado recebido.");
  }

  return JSON.parse(e.postData.contents);
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSpreadsheet() {
  if (SPREADSHEET_ID) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (!ss) {
    throw new Error("Planilha ativa não encontrada. Informe SPREADSHEET_ID no Code.gs.");
  }

  return ss;
}

function getSheet(name) {
  const sheet = getSpreadsheet().getSheetByName(name);

  if (!sheet) {
    throw new Error(`A aba "${name}" não foi encontrada.`);
  }

  return sheet;
}

function usuarioAutorizado(email) {
  if (!email) return false;

  const sheet = getSheet(SHEET_NAME_EMAILS);
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) return false;

  const emails = sheet
    .getRange(2, 1, lastRow - 1, 1)
    .getValues()
    .flat()
    .map((value) => String(value).trim().toLowerCase())
    .filter(Boolean);

  return emails.includes(String(email).trim().toLowerCase());
}

function adicionarLinhaTexto(sheet, values) {
  const row = sheet.getLastRow() + 1;

  sheet.appendRow(Array(values.length).fill(""));

  sheet
    .getRange(row, 1, 1, values.length)
    .setValues([values]);
}

function salvarSolicitacao(request, context) {
  const sheet = getSheet(SHEET_NAME_REQUESTS);
  const now = new Date();
  const email = context.email || "";

  if (request.tipoCertidao === "registro_imovel") {
    salvarRegistroImovel(sheet, now, email, request);
    return;
  }

  salvarRegistroComum(sheet, now, email, request);
}

function salvarRegistroComum(sheet, dateTime, email, request) {
  adicionarLinhaTexto(sheet, [
    dateTime,
    email,

    request.protocoloMobi || "",
    request.tipoCertidao || "",
    request.subtipo || "",

    request.cpf || "",
    request.cnpj || "",
    request.nome1 || "",
    request.nome2 || "",
    request.dataEvento || "",

    request.uf || "",
    request.cidade || "",
    request.cartorio || "",

    request.livro || "",
    request.folha || "",
    request.termo || "",

    request.indicacaoFiscal || "",

    "",
    "",
    ""
  ]);
}

function salvarRegistroImovel(sheet, dateTime, email, request) {
  const items = request.itens || [];

  items.forEach((item) => {
    adicionarLinhaTexto(sheet, [
      dateTime,
      email,

      request.protocoloMobi || "",
      request.tipoCertidao || "",

      "",

      "",
      "",
      "",
      "",
      "",

      "",
      "",
      "",

      "",
      "",
      "",

      "",

      item.tipoItem || "",
      item.numeroItem || "",
      item.incluirOnus || ""
    ]);
  });
}
