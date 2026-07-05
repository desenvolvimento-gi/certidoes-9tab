const SPREADSHEET_ID = ""; // Se o script não estiver vinculado à planilha, informe o ID aqui.
const SHEET_NAME_REQUESTS = "Solicitações";
const SHEET_NAME_EMAILS = "Emails";
const SHEET_NAME_RESPONSES = "Respostas";

// Cole aqui o mesmo Client ID usado no frontend.
const GOOGLE_CLIENT_ID = "774514418031-s0pe6oe5vsa7mbbbfc906r4l71mbhg49.apps.googleusercontent.com";

// Sprint 5: valida o ID token no backend e verifica autorização na aba Emails.
const REQUIRE_VALID_GOOGLE_TOKEN = true;
const REQUIRE_AUTHORIZED_EMAIL = true;

function doGet(e) {
  const action = e && e.parameter ? e.parameter.action : "";

  if (action === "verifyAccess") {
    return handleVerifyAccess(e);
  }

  if (action === "listRequests") {
    return handleListRequests(e);
  }

  return jsonResponse({
    ok: true,
    message: "API de Solicitação de Certidões ativa."
  });
}

function handleVerifyAccess(e) {
  const callback = e.parameter.callback || "";
  const emailParam = String(e.parameter.email || "").trim().toLowerCase();
  const idToken = e.parameter.idToken || "";

  try {
    // Pré-check de autorização para UX.
    // Preferimos usar email no JSONP para evitar enviar ID token pela URL.
    // A validação forte do token continua sendo feita no doPost(e), antes de salvar.
    let user;

    if (idToken) {
      user = verifyGoogleIdToken(idToken);
    } else if (emailParam) {
      user = {
        email: emailParam,
        name: ""
      };
    } else {
      throw new Error("E-mail não recebido para verificar autorização.");
    }

    const accessInfo = getAuthorizedUserInfo(user.email);

    return jsonpResponse(callback, {
      ok: true,
      authorized: accessInfo.authorized,
      stats: accessInfo.stats,
      user
    });
  } catch (error) {
    console.error(error);

    return jsonpResponse(callback, {
      ok: false,
      authorized: false,
      message: error.message || "Erro ao verificar autorização."
    });
  }
}


function handleListRequests(e) {
  const callback = e.parameter.callback || "";
  const idToken = e.parameter.idToken || "";

  try {
    const user = verifyGoogleIdToken(idToken);
    const email = String(user.email || "").trim().toLowerCase();

    if (REQUIRE_AUTHORIZED_EMAIL && !usuarioAutorizado(email)) {
      throw new Error("Usuário não autorizado a consultar solicitações.");
    }

    const requests = listarSolicitacoesPorEmail(email);

    return jsonpResponse(callback, {
      ok: true,
      user: {
        email,
        name: user.name || ""
      },
      requests
    });
  } catch (error) {
    console.error(error);

    return jsonpResponse(callback, {
      ok: false,
      message: error.message || "Erro ao consultar solicitações."
    });
  }
}


function doPost(e) {
  try {
    const payload = parsePayload(e);
    const request = payload.request;

    if (!request) {
      throw new Error("Payload inválido: request não encontrado.");
    }

    const authUser = resolveAuthenticatedUser(payload);
    const email = String(authUser.email || "").trim().toLowerCase();

    if (REQUIRE_AUTHORIZED_EMAIL && !usuarioAutorizado(email)) {
      throw new Error("Usuário não autorizado a enviar solicitações.");
    }

    salvarSolicitacao(request, {
      email,
      userName: authUser.name || "",
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

function resolveAuthenticatedUser(payload) {
  if (!REQUIRE_VALID_GOOGLE_TOKEN) {
    return {
      email: String(payload.userEmail || "").trim().toLowerCase(),
      name: payload.userName || ""
    };
  }

  return verifyGoogleIdToken(payload.idToken);
}

function verifyGoogleIdToken(idToken) {
  if (!idToken) {
    throw new Error("Token Google não recebido.");
  }

  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === "COLE_AQUI_O_CLIENT_ID_DO_GOOGLE") {
    throw new Error("Configure GOOGLE_CLIENT_ID no Code.gs.");
  }

  const url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(idToken);
  const response = UrlFetchApp.fetch(url, {
    method: "get",
    muteHttpExceptions: true
  });

  if (response.getResponseCode() !== 200) {
    throw new Error("Token Google inválido ou expirado.");
  }

  const tokenInfo = JSON.parse(response.getContentText());

  if (tokenInfo.aud !== GOOGLE_CLIENT_ID) {
    throw new Error("Token Google emitido para outro client_id.");
  }

  if (String(tokenInfo.email_verified) !== "true") {
    throw new Error("E-mail Google não verificado.");
  }

  if (!tokenInfo.email) {
    throw new Error("Token Google sem e-mail.");
  }

  return {
    email: String(tokenInfo.email).trim().toLowerCase(),
    name: tokenInfo.name || ""
  };
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonpResponse(callback, payload) {
  if (!/^[A-Za-z_$][0-9A-Za-z_$]*(\.[A-Za-z_$][0-9A-Za-z_$]*)*$/.test(callback)) {
    return jsonResponse({
      ok: false,
      message: "Callback JSONP inválido."
    });
  }

  return ContentService
    .createTextOutput(`${callback}(${JSON.stringify(payload)});`)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
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
  return getAuthorizedUserInfo(email).authorized;
}

function getAuthorizedUserInfo(email) {
  if (!email) {
    return {
      authorized: false,
      stats: emptyUserStats()
    };
  }

  const sheet = getSheet(SHEET_NAME_EMAILS);
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  if (lastRow < 2 || lastColumn === 0) {
    return {
      authorized: false,
      stats: emptyUserStats()
    };
  }

  const values = sheet
    .getRange(1, 1, lastRow, lastColumn)
    .getDisplayValues();

  const headers = values[0].map((header) => String(header).trim());
  const index = createHeaderIndex(headers);

  const emailColumnIndex = index["Email"] !== undefined ? index["Email"] : 0;
  const normalizedEmail = String(email).trim().toLowerCase();

  const row = values
    .slice(1)
    .find((currentRow) => String(currentRow[emailColumnIndex] || "").trim().toLowerCase() === normalizedEmail);

  if (!row) {
    return {
      authorized: false,
      stats: emptyUserStats()
    };
  }

  return {
    authorized: true,
    stats: {
      solicitadas: parseIntegerCell(getCell(row, index, "Solicitadas")),
      emitidas: parseIntegerCell(getCell(row, index, "Emitidas"))
    }
  };
}

function emptyUserStats() {
  return {
    solicitadas: 0,
    emitidas: 0
  };
}

function parseIntegerCell(value) {
  const digits = String(value || "").replace(/\D/g, "");

  if (!digits) return 0;

  return Number(digits);
}


function listarSolicitacoesPorEmail(email) {
  const sheet = getSheet(SHEET_NAME_RESPONSES);
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  if (lastRow < 2 || lastColumn === 0) {
    return [];
  }

  const values = sheet
    .getRange(1, 1, lastRow, lastColumn)
    .getDisplayValues();

  const headers = values[0].map((header) => String(header).trim());
  const rows = values.slice(1);

  const index = createHeaderIndex(headers);
  const solicitanteIndex = index["Solicitante"];

  if (solicitanteIndex === undefined) {
    throw new Error('A coluna "Solicitante" não foi encontrada na aba Respostas.');
  }

  return rows
    .filter((row) => String(row[solicitanteIndex] || "").trim().toLowerCase() === String(email).trim().toLowerCase())
    .map((row) => mapResponseRow(row, index))
    .reverse();
}

function createHeaderIndex(headers) {
  return headers.reduce((acc, header, index) => {
    acc[header] = index;
    return acc;
  }, {});
}

function getCell(row, index, header) {
  const columnIndex = index[header];

  if (columnIndex === undefined) {
    return "";
  }

  return row[columnIndex] || "";
}

function mapResponseRow(row, index) {
  return {
    protocolo: getCell(row, index, "Protocolo"),
    solicitante: getCell(row, index, "Solicitante"),
    tipoCertidao: getCell(row, index, "Tipo de certidão"),
    qualCertidao: getCell(row, index, "Qual certidão?"),
    dataHoraPedido: getCell(row, index, "Data/hora do pedido"),
    status: getCell(row, index, "Status"),
    detalhamento: getCell(row, index, "Detalhamento"),
    numeroProtocolo: getCell(row, index, "Número do protocolo"),
    numeroCertidao: getCell(row, index, "Número da certidão"),
    dataHoraEmissao: getCell(row, index, "Data/hora da emissão"),
    dataValidade: getCell(row, index, "Data de validade")
  };
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
