function registerLoginEvents() {
  DOM.googleLoginButton.addEventListener("click", () => {
          const fakeUser = {
              name: "William",
              email: "william@email.com"
          };

          showDashboard(fakeUser);
      });
}