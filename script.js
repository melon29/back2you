console.clear();

// -------- ROUTES --------
const routes = {
  home: "home.html",
  lostpets: "lostpets.html",
  foundpets: "foundpets.html",
  auth: "auth.html",
  report: "report.html",
  account: "account.html"
};

// -------- HELPERS --------
const getLoggedInUser = () => localStorage.getItem("loggedInUser");
const isUserLoggedIn = () => !!localStorage.getItem("loggedInUser");

function updateNav() {
  const navList = document.getElementById("menuNavul");
  const lastLi = navList.querySelector("li:last-child a");

  lastLi.innerHTML = isUserLoggedIn()
    ? "Account"
    : `<i class="fa-solid fa-arrow-right-to-bracket" style="margin-right:8px"></i> Login`;
}

// -------- ROUTER --------
function loadPage(page) {
  const pageDiv = document.getElementById("page");

  if (page === "auth" && isUserLoggedIn()) page = "account";

  if ((page === "account" || page === "report") && !isUserLoggedIn()) {
    page = "auth";
  }

  if (!routes[page]) {
    pageDiv.innerHTML = "<h2 style='text-align:center'>Page Not Found</h2>";
    return;
  }

  pageDiv.innerHTML = `<div style="text-align:center;padding:60px;font-size:22px;">Loading...</div>`;

  fetch(routes[page])
    .then(res => res.text())
    .then(html => {
      pageDiv.innerHTML = html;

      if (page === "lostpets" || page === "foundpets") initLostPets();
      if (page === "report") initReportPage();
      if (page === "account") initAccountPage();
    })
    .catch(() => {
      pageDiv.innerHTML = "<h2 style='text-align:center'>Page Not Found</h2>";
    });
}

// -------- INITIAL LOAD --------
document.addEventListener("DOMContentLoaded", () => {
  updateNav();
  loadPage("home");
});

// -------- NAVIGATION HANDLER --------
document.getElementById("menuNavul").addEventListener("click", e => {
  e.preventDefault();

  let target = e.target;
  if (target.tagName === "I") target = target.parentElement;
  if (!target.classList.contains("menuNavlist")) return;

  const text = target.textContent.trim();

  const map = {
    Home: "home",
    "Found Pets": "foundpets",
    "Lost Pets": "lostpets",
    Login: "auth",
    Account: "account"
  };

  if (map[text]) loadPage(map[text]);
});

// -------- REPORT BUTTON --------
document.getElementById("reportPetBtn").addEventListener("click", () => {
  if (isUserLoggedIn()) loadPage("report");
  else {
    document.getElementById("login-alert-box").style.top = "10%";
    loadPage("auth");
  }
});

// -------- ALERT CLOSE --------
document.getElementById("login-alert-box-close-btn").addEventListener("click", () => {
  document.getElementById("login-alert-box").style.top = "-120%";
});

// -------- GLOBAL CLICK HANDLER --------
document.addEventListener("click", e => {
  if (!e.target) return;

  switch (e.target.id) {
    case "home-hero-reportBtn":
      isUserLoggedIn() ? loadPage("report") : loadPage("auth");
      break;

    case "home-lost-pets-spotlight-btn":
      loadPage("lostpets");
      break;

    case "switch-to-reg":
      document.getElementById("login-container").style.display = "none";
      document.getElementById("reg-container").style.display = "block";
      break;

    case "switch-to-login":
      document.getElementById("reg-container").style.display = "none";
      document.getElementById("login-container").style.display = "block";
      break;

    case "login-submit-btn":
      loginUser();
      break;

    case "logout-btn":
      logoutUser();
      break;

    case "reg-submit-btn":
      registerUser();
      break;
  }
});

// -------- LOGIN --------
function loginUser() {
  const email = document.getElementById("userEmail").value.trim();
  const password = document.getElementById("userPassword").value;

  const stored = localStorage.getItem("user_" + email);
  if (!stored) return alert("User not found");

  const user = JSON.parse(stored);
  if (user.password !== password) return alert("Incorrect password");

  localStorage.setItem("loggedInUser", email);
  updateNav();
  loadPage("account");
}

// -------- LOGOUT --------
function logoutUser() {
  localStorage.removeItem("loggedInUser");
  updateNav();
  loadPage("home");
}

// -------- REGISTER --------
function registerUser() {
  const name = document.getElementById("user-name").value.trim();
  const email = document.getElementById("user-email").value.trim();
  const phone = document.getElementById("user-phone").value.trim();
  const pincode = document.getElementById("user-pincode").value.trim();
  const password = document.getElementById("user-pass").value;

  if (!name || !email || !password) return alert("Fill all required fields");
  if (localStorage.getItem("user_" + email)) return alert("User already exists");

  const user = { name, email, phone, pincode, password };
  localStorage.setItem("user_" + email, JSON.stringify(user));

  alert("Account created successfully!");
  document.getElementById("reg-container").style.display = "none";
  document.getElementById("login-container").style.display = "block";
}

// -------- ACCOUNT PAGE --------
function initAccountPage() {
  const email = getLoggedInUser();
  const data = localStorage.getItem("user_" + email);
  if (!data) return;

  const user = JSON.parse(data);
  document.getElementById("account-name").textContent = user.name;
  document.getElementById("account-email").textContent = user.email;
  document.getElementById("account-phone").textContent = user.phone || "Not provided";
  document.getElementById("account-pincode").textContent = user.pincode || "Not provided";
}

// -------- IMAGE PREVIEW --------
function previewImage(input, previewId) {
  const preview = document.getElementById(previewId);
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => preview.src = e.target.result;
    reader.readAsDataURL(input.files[0]);
    preview.style.display = "block";
  }
}

// -------- PET STORAGE --------
function savePetData(pet) {
  const pets = JSON.parse(localStorage.getItem("pets")) || [];
  pets.push(pet);
  localStorage.setItem("pets", JSON.stringify(pets));
}

function loadPets() {
  return JSON.parse(localStorage.getItem("pets")) || [];
}