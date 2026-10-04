const passwordField = document.getElementById("loginPassword");
const revealButton = document.getElementById("revealPassword");
revealButton.addEventListener("click", () => {
  const show = passwordField.type === "password";
  passwordField.type = show ? "text" : "password";
  revealButton.textContent = show ? "Hide" : "Show";
  revealButton.setAttribute("aria-label", show ? "Hide password" : "Show password");
});

document.querySelectorAll("[data-demo]").forEach(button => {
  button.addEventListener("click", () => {
    const [username, password] = button.dataset.demo.split("|");
    const usernameField = document.getElementById("loginEmail");
    usernameField.value = username;
    passwordField.value = password;
    // app.js listens for input to reset any OTP step in progress
    [usernameField, passwordField].forEach(field => field.dispatchEvent(new Event("input")));
    document.getElementById("captchaInput").focus();
  });
});
