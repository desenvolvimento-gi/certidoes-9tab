const APP_STATE = {
  currentUser: null,
  idToken: "",
  isSubmitting: false
};

function setCurrentUser(user) {
  APP_STATE.currentUser = user;
}

function getCurrentUser() {
  return APP_STATE.currentUser;
}

function setIdToken(idToken) {
  APP_STATE.idToken = idToken || "";
}

function getIdToken() {
  return APP_STATE.idToken;
}

function clearSession() {
  APP_STATE.currentUser = null;
  APP_STATE.idToken = "";
}

function setSubmitting(isSubmitting) {
  APP_STATE.isSubmitting = isSubmitting;
}

function isSubmitting() {
  return APP_STATE.isSubmitting;
}
