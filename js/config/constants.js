const APP_CONFIG = {
  APP_NAME: "Solicitação de Certidões - 9tab",
  DEBUG: true,

  // Cole aqui a URL /exec do Web App do Apps Script depois do deploy.
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbz_LRL71LI0bEuWRRsCvKfxFkECPmIUGjj-GpY41d9gEsDDhic9qVjTlaWR6EebdUhn/exec",

  // Apps Script Web Apps costumam ter limitação de CORS.
  // Para esta primeira integração, usamos "no-cors": o envio funciona,
  // mas o navegador não consegue ler a resposta real do servidor.
  APPS_SCRIPT_FETCH_MODE: "no-cors"
};
