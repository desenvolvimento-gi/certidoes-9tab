const APP_CONFIG = {
  APP_NAME: "Solicitação de Certidões - 9tab",
  DEBUG: true,

  // URL /exec do Web App do Apps Script.
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbz_LRL71LI0bEuWRRsCvKfxFkECPmIUGjj-GpY41d9gEsDDhic9qVjTlaWR6EebdUhn/exec",

  // Apps Script Web Apps costumam ter limitação de CORS.
  // Nesta versão, o envio usa no-cors: o envio funciona,
  // mas o navegador não consegue ler a resposta real do servidor.
  APPS_SCRIPT_FETCH_MODE: "no-cors",

  // Cole aqui o Client ID do OAuth 2.0 do tipo "Web application".
  // Exemplo: "1234567890-abcxyz.apps.googleusercontent.com"
  GOOGLE_CLIENT_ID: "774514418031-s0pe6oe5vsa7mbbbfc906r4l71mbhg49.apps.googleusercontent.com",

  // Lista opcional para bloquear o usuário já no frontend.
  // Se ficar vazia, qualquer conta Google autenticada verá o workspace,
  // mas o Apps Script continuará validando token e autorização no backend.
  AUTHORIZED_EMAILS: []
};
