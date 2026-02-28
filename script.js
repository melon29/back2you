const routes = {
   "home": "home.html",
   "lostpets": "lostpets.html",
   "foundpets": "foundpets.html",
   "howitworks": "howitworks.html",
   "auth": "auth.html",
   "report": "report.html",
   "account": "account.html"
};

// ---------- HELPERS ----------

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

// ---------- ROUTER ----------

function loadPage(page) {
   const pageDiv = document.getElementById("page");

   if (page === "auth" && isUserLoggedIn()) page = "account";

   if ((page === "account" || page === "report") && !isUserLoggedIn()) {
      loadPage("auth");
      return;
   }

   const pageUrl = routes[page];
   if (!pageUrl) return;

   pageDiv.innerHTML = `<div style="text-align:center;padding:60px;font-size:22px;">Loading...</div>`;

   fetch(pageUrl)
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

// ---------- INITIAL LOAD ----------

document.addEventListener("DOMContentLoaded", () => {
   updateNav();
   loadPage("home");
});

// ---------- NAVIGATION ----------

document.getElementById("menuNavul").addEventListener("click", e => {
   e.preventDefault();
   const txt = e.target.textContent.trim();

   const map = {
      "Home": "home",
      "Found Pets": "foundpets",
      "Lost Pets": "lostpets",
      "How it works": "howitworks",
      "Login": "auth",
      "Account": "account"
   };

   if (map[txt]) loadPage(map[txt]);
});

// ---------- REPORT BUTTON ----------

document.getElementById("reportPetBtn").addEventListener("click", () => {
   if (isUserLoggedIn()) loadPage("report");
   else {
      document.getElementById("login-alert-box").style.top = "10%";
      loadPage("auth");
   }
});

// ---------- ALERT CLOSE ----------

document.getElementById("login-alert-box-close-btn").addEventListener("click", () => {
   document.getElementById("login-alert-box").style.top = "-110%";
});

// ---------- GLOBAL CLICK HANDLER ----------

document.addEventListener("click", e => {

   if (e.target.id === "home-hero-reportBtn") {
      if (isUserLoggedIn()) loadPage("report");
      else {
         document.getElementById("login-alert-box").style.top = "10%";
         loadPage("auth");
      }
   }

   if (e.target.id === "home-hiw-more-btn") loadPage("howitworks");
   if (e.target.id === "home-lost-pets-spotlight-btn") loadPage("lostpets");

   if (e.target.id === "switch-to-reg") {
      document.getElementById("login-container").style.display = "none";
      document.getElementById("reg-container").style.display = "block";
   }

   if (e.target.id === "switch-to-login") {
      document.getElementById("reg-container").style.display = "none";
      document.getElementById("login-container").style.display = "block";
   }

   if (e.target.id === "login-submit-btn") loginUser();
   if (e.target.id === "logout-btn") logoutUser();
   if (e.target.id === "reg-submit-btn") registerUser();
});

// ---------- LOGIN ----------

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

// ---------- LOGOUT ----------

function logoutUser() {
   localStorage.removeItem("loggedInUser");
   updateNav();
   loadPage("auth");
}

// ---------- REGISTER ----------

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

// ---------- TOGGLE SWITCH ----------

document.addEventListener("change", e => {
   if (e.target.id !== "toggle") return;

   const lost = document.getElementById("report-lost-container");
   const found = document.getElementById("report-found-container");

   if (!lost || !found) return;

   if (e.target.checked) {
      lost.style.transform = "translateX(-110%)";
      found.style.transform = "translateX(0%)";
   } else {
      lost.style.transform = "translateX(0%)";
      found.style.transform = "translateX(110%)";
   }
});

// ---------- ACCOUNT PAGE ----------

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

// ---------- IMAGE PREVIEW ----------

function previewImage(input, previewId) {
   const preview = document.getElementById(previewId);
   if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = e => preview.src = e.target.result;
      reader.readAsDataURL(input.files[0]);
   }
}

// ---------- PET STORAGE ----------

function savePetData(pet) {
   let pets = JSON.parse(localStorage.getItem("pets")) || [];
   pets.push(pet);
   localStorage.setItem("pets", JSON.stringify(pets));
}

function loadPets() {
   return JSON.parse(localStorage.getItem("pets")) || [];
}