const APP_STATE = {
  currentUser: null,
  isSubmitting: false
};

function setCurrentUser(user) {
  APP_STATE.currentUser = user;
}

function getCurrentUser() {
  return APP_STATE.currentUser;
}

function setSubmitting(isSubmitting) {
  APP_STATE.isSubmitting = isSubmitting;
}

function isSubmitting() {
  return APP_STATE.isSubmitting;
}
