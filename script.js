alert("JS is working");

// -------- ROUTES --------
const routes = {
  "home": "home.html",
  "lostpets": "lostpets.html",
  "foundpets": "foundpets.html",
  "howitworks": "howitworks.html",
  "auth": "auth.html",
  "report": "report.html",
  "account": "account.html"
};

// -------- HELPERS --------
function getLoggedInUser() {
  return localStorage.getItem("loggedInUser");
}

function isUserLoggedIn() {
  return !!localStorage.getItem("loggedInUser");
}

function updateNav() {
  const navList = document.getElementById("menuNavul");
  const lastLi = navList.querySelector("li:last-child a");

  if (isUserLoggedIn()) {
    lastLi.innerHTML = `Account`;
  } else {
    lastLi.innerHTML = `<i class="fa-solid fa-arrow-right-to-bracket" style="margin-right:10px"></i>Login`;
  }
}

// -------- ROUTER --------
function loadPage(page) {
  const pageDiv = document.getElementById("page");

  // Redirect logged in user trying to access auth page
  if (page === "auth" && isUserLoggedIn()) page = "account";

  // Protect pages
  if ((page === "account" || page === "report") && !isUserLoggedIn()) {
    loadPage("auth");
    return;
  }

  const pageUrl = routes[page];
  if (!pageUrl) {
    pageDiv.innerHTML = "<h2 style='text-align:center'>Page Not Found</h2>";
    return;
  }

  pageDiv.innerHTML = `<div style="text-align:center;padding:60px;font-size:22px;">Loading...</div>`;

  fetch(pageUrl)
    .then(res => res.text())
    .then(html => {
      pageDiv.innerHTML = html;

      // Initialize page-specific JS
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

// -------- NAVIGATION --------
document.getElementById("menuNavul").addEventListener("click", e => {
  e.preventDefault();
  let target = e.target;

  // Fix: If clicking <i> inside link
  if (target.tagName === "I") target = target.parentElement;

  const txt = target.textContent.trim();

  const map = {
    "Home": "home",
    "Found Pets": "foundpets",
    "Lost Pets": "lostpets",
    "How it Works": "howitworks",
    "Login": "auth",
    "Account": "account"
  };

  if (map[txt]) loadPage(map[txt]);
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
  document.getElementById("login-alert-box").style.top = "-110%";
});

// -------- GLOBAL CLICK HANDLER --------
document.addEventListener("click", e => {
  if (!e.target) return;

  switch(e.target.id) {
    case "home-hero-reportBtn":
      if (isUserLoggedIn()) loadPage("report");
      else {
        document.getElementById("login-alert-box").style.top = "10%";
        loadPage("auth");
      }
      break;
    case "home-hiw-more-btn":
      loadPage("howitworks");
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

// -------- LOGIN / LOGOUT / REGISTER --------
function loginUser() {
  const email = document.getElementById("userEmail").value.trim();
  const password = document.getElementById("userPassword").value;
  const storedUser = localStorage.getItem("user_" + email);
  if (!storedUser) return alert("User not found");

  const user = JSON.parse(storedUser);
  if (user.password !== password) return alert("Incorrect password");

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

// -------- ACCOUNT PAGE INIT --------
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

// -------- IMAGE PREVIEW & PET STORAGE --------
function previewImage(input, previewId) {
  const preview = document.getElementById(previewId);
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => preview.src = e.target.result;
    reader.readAsDataURL(input.files[0]);
    preview.style.display = "block";
  }
}

function savePetData(pet) {
  let pets = JSON.parse(localStorage.getItem("pets")) || [];
  pets.push(pet);
  localStorage.setItem("pets", JSON.stringify(pets));
}

function loadPets() {
  return JSON.parse(localStorage.getItem("pets")) || [];
}