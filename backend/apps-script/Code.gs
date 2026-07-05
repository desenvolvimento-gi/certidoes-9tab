const SPREADSHEET_ID = ""; // Se o script não estiver vinculado à planilha, informe o ID aqui.
const SHEET_NAME_REQUESTS = "Solicitações";
const SHEET_NAME_EMAILS = "Emails";

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

  return jsonResponse({
    ok: true,
    message: "API de Solicitação de Certidões ativa."
  });
}

function handleVerifyAccess(e) {
  const callback = e.parameter.callback || "";
  const idToken = e.parameter.idToken || "";

  try {
    const user = verifyGoogleIdToken(idToken);
    const authorized = usuarioAutorizado(user.email);

    return jsonpResponse(callback, {
      ok: true,
      authorized,
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
