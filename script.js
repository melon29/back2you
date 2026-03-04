console.clear();

document.addEventListener("DOMContentLoaded", () => {

  const routes = {
    home: "home.html",
    lostpets: "lostpets.html",
    foundpets: "foundpets.html",
    auth: "auth.html",
    report: "report.html",
    account: "account.html"
  };

  const pageDiv = document.getElementById("page");

  const getLoggedInUser = () => localStorage.getItem("loggedInUser");
  const isUserLoggedIn = () => !!localStorage.getItem("loggedInUser");

  function updateNav() {
    const navList = document.getElementById("menuNavul");
    const last = navList.querySelector("li:last-child a");

    last.innerHTML = isUserLoggedIn() ? "Account" : "Login";
  }

  function loadPage(page) {
    if (page === "auth" && isUserLoggedIn()) page = "account";

    if ((page === "account" || page === "report") && !isUserLoggedIn()) {
      page = "auth";
    }

    if (!routes[page]) {
      pageDiv.innerHTML = "<h2 style='text-align:center'>Page Not Found</h2>";
      return;
    }

    pageDiv.innerHTML = `<div style="text-align:center;padding:60px">Loading...</div>`;

    fetch(routes[page])
      .then(r => r.text())
      .then(html => {
        pageDiv.innerHTML = html;

        if (page === "lostpets" || page === "foundpets") initLostPets?.();
        if (page === "report") initReportPage?.();
        if (page === "account") initAccountPage?.();
      });
  }

  updateNav();
  loadPage("home");

  // ======= MENU CLICK HANDLER =======
  document.getElementById("menuNavul").addEventListener("click", e => {
    let el = e.target;
    if (el.tagName === "I") el = el.parentElement;

    if (!el.classList.contains("menuNavlist")) return;

    const txt = el.textContent.trim();

    if (txt === "Home") loadPage("home");
    if (txt === "Found Pets") loadPage("foundpets");
    if (txt === "Lost Pets") loadPage("lostpets");
    if (txt === "Login") loadPage("auth");
    if (txt === "Account") loadPage("account");
  });

  // ======= REPORT BUTTON =======
  document.getElementById("reportPetBtn").addEventListener("click", () => {
    isUserLoggedIn() ? loadPage("report") : loadPage("auth");
  });

  // ======= GLOBAL CLICK HANDLER =======
  document.addEventListener("click", e => {
    const id = e.target.id;

    if (id === "login-submit-btn") loginUser();
    if (id === "logout-btn") logoutUser();
    if (id === "reg-submit-btn") registerUser();
  });

  function loginUser() {
    const email = userEmail.value.trim();
    const pass = userPassword.value;

    const user = localStorage.getItem("user_" + email);
    if (!user) return alert("User not found");

    const data = JSON.parse(user);
    if (data.password !== pass) return alert("Wrong password");

    localStorage.setItem("loggedInUser", email);
    updateNav();
    loadPage("account");
  }

  function logoutUser() {
    localStorage.removeItem("loggedInUser");
    updateNav();
    loadPage("home");
  }

  function registerUser() {
    const name = user-name.value.trim();
    const email = user-email.value.trim();
    const pass = user-pass.value;

    if (!name || !email || !pass) return alert("Fill all fields");

    if (localStorage.getItem("user_" + email)) return alert("User exists");

    localStorage.setItem("user_" + email, JSON.stringify({ name, email, password: pass }));

    alert("Account created");
    loadPage("auth");
  }

});