const routes = {
   "home": "home.html",
   "lostpets": "lostpets.html",
   "foundpets": "foundpets.html",
   "howitworks": "howitworks.html",
   "auth": "auth.html",
   "report": "report.html",
   "account": "account.html"
};

// --- HELPERS ---

function getLoggedInUser() {
   return localStorage.getItem("loggedInUser");
}

function isUserLoggedIn() {
   return !!localStorage.getItem("loggedInUser");
}

/**
 * Updates the Navigation UI based on login status
 */
function updateNav() {
   const navList = document.getElementById("menuNavul");
   const lastLi = navList.querySelector("li:last-child a");
   
   if (isUserLoggedIn()) {
      lastLi.innerHTML = `Account`;
   } else {
      lastLi.innerHTML = `<i class="fa-solid fa-arrow-right-to-bracket" style="margin-right: 10px"></i>Login`;
   }
}

// --- CORE ROUTING ---

function loadPage(page) {
   const pageDiv = document.getElementById("page");
   
   // Redirect logged-in users away from Auth page to Account
   if (page === "auth" && isUserLoggedIn()) {
      page = "account";
   }
   
   // Protect Account and Report pages
   if ((page === "account" || page === "report") && !isUserLoggedIn()) {
      loadPage("auth");
      return;
   }
   
   const pageUrl = routes[page];
   if (!pageUrl) return;
   
   fetch(pageUrl)
      .then(response => {
         if (!response.ok) throw new Error("Page not found");
         return response.text();
      })
      .then(html => {
         pageDiv.innerHTML = html;
         
         // Initialize specific page logic
         if (page === "lostpets" || page === "foundpets") {
            initLostPets(); // from pets.js
         }
         
         if (page === "report") {
            initReportPage(); // from pets.js
         }
         
         if (page === "account") {
            initAccountPage();
         }
      })
      .catch(err => {
         pageDiv.innerHTML = `<h1>Error 404</h1><p>${err.message}</p>`;
      });
}

// --- INITIALIZATION ---

window.addEventListener("DOMContentLoaded", () => {
   updateNav(); // Sets "Login" or "Account" on start
   loadPage("home");
});

// --- EVENT LISTENERS ---

// Navigation Menu Click
document.getElementById("menuNavul").addEventListener("click", e => {
   e.preventDefault();
   const linkText = e.target.textContent.trim();
   
   switch (linkText) {
      case "Home":
         loadPage("home");
         break;
      case "Found Pets":
         loadPage("foundpets");
         break;
      case "Lost Pets":
         loadPage("lostpets");
         break;
      case "How it works":
         loadPage("howitworks");
         break;
      case "Login":
         loadPage("auth");
         break;
      case "Account": // Added this case
         loadPage("account");
         break;
   }
});

// Report Button
document.getElementById("reportPetBtn").addEventListener("click", () => {
   if (isUserLoggedIn()) {
      loadPage("report");
   } else {
      document.getElementById("login-alert-box").style.top = "10%";
      loadPage("auth");
   }
});

// Close Alert Box
document.getElementById("login-alert-box-close-btn").addEventListener("click", () => {
   document.getElementById("login-alert-box").style.top = "-110%"
});

// Global Click Delegation
document.addEventListener("click", (e) => {
   
   // Home Hero Buttons
   if (e.target && e.target.id === "home-hero-reportBtn") {
      if (isUserLoggedIn()) loadPage("report");
      else {
         document.getElementById("login-alert-box").style.top = "10%";
         loadPage("auth");
      }
   }
   
   if (e.target && e.target.id === "home-hiw-more-btn") loadPage("howitworks");
   if (e.target && e.target.id === "home-lost-pets-spotlight-btn") loadPage("lostpets");
   
   // Auth Swapping
   if (e.target.id === "switch-to-reg") {
      document.getElementById("login-container").style.display = "none";
      document.getElementById("reg-container").style.display = "block";
   }
   
   if (e.target.id === "switch-to-login") {
      document.getElementById("reg-container").style.display = "none";
      document.getElementById("login-container").style.display = "block";
   }
   
   // Modal Close
   if (e.target.id === "lost-pet-close-btn") {
      const modal = document.getElementById("lost-pet-info-div");
      const modalContent = document.querySelector(".lost-pet-modal-content");
      modalContent.classList.add("fade-out");
      setTimeout(() => {
         modal.style.display = "none";
         modalContent.classList.remove("fade-out");
      }, 200);
   }
   
   // --- LOGIN LOGIC ---
   if (e.target.id === "login-submit-btn") {
      const email = document.getElementById("userEmail").value.trim();
      const password = document.getElementById("userPassword").value;
      const storedUser = localStorage.getItem("user_" + email);
      
      if (!storedUser) {
         alert("User not found");
         return;
      }
      
      const userObj = JSON.parse(storedUser);
      if (userObj.password !== password) {
         alert("Incorrect password");
         return;
      }
      
      localStorage.setItem("loggedInUser", email);
      alert("Login successful!");
      updateNav(); // Update UI immediately
      loadPage("account");
   }
   
   // --- LOGOUT LOGIC ---
   if (e.target.id === "logout-btn") {
      localStorage.removeItem("loggedInUser");
      updateNav(); // Update UI immediately
      loadPage("auth");
   }
   
   // --- REGISTRATION LOGIC ---
   if (e.target.id === "reg-submit-btn") {
      const name = document.getElementById("user-name").value.trim();
      const email = document.getElementById("user-email").value.trim();
      const phone = document.getElementById("user-phone").value.trim();
      const pincode = document.getElementById("user-pincode").value.trim();
      const password = document.getElementById("user-pass").value;
      
      if (!name || !email || !password) {
         alert("Please fill all required fields");
         return;
      }
      
      if (localStorage.getItem("user_" + email)) {
         alert("User already exists");
         return;
      }
      
      const user = { name, email, phone, pincode, password };
      localStorage.setItem("user_" + email, JSON.stringify(user));
      alert("Account created successfully!");
      // Automatically switch to login view
      document.getElementById("reg-container").style.display = "none";
      document.getElementById("login-container").style.display = "block";
   }
});

// Handle Toggle Switch for Report Page
document.addEventListener("change", (e) => {
   if (e.target.id !== "toggle") return;
   
   const lost = document.getElementById("report-lost-container");
   const found = document.getElementById("report-found-container");
   
   if (!lost || !found) return;
   
   if (e.target.checked) {
      lost.style.transform = "translateX(calc(-100% - 50px))";
      found.style.transform = "translateX(calc(0% - 50px))";
   } else {
      lost.style.transform = "translateX(0%)";
      found.style.transform = "translateX(100%)";
   }
});

// --- PAGE INITIALIZERS ---

function initAccountPage() {
   const loggedInEmail = localStorage.getItem("loggedInUser");
   const userData = localStorage.getItem("user_" + loggedInEmail);
   
   if (!userData) return;
   const user = JSON.parse(userData);
   
   // Update Text
   document.getElementById("account-name").textContent = user.name;
   document.getElementById("account-email").textContent = user.email;
   document.getElementById("account-phone").textContent = user.phone || "Not provided";
   document.getElementById("account-pincode").textContent = user.pincode || "Not provided";
   
   // Bonus: Load past reports for this specific user
   const allReports = JSON.parse(localStorage.getItem("lostReports")) || [];
   const userReports = allReports.filter(report => report.reportedBy === loggedInEmail);
   const listContainer = document.querySelector(".past-reports ul");
   
   if (userReports.length > 0) {
      listContainer.innerHTML = userReports.map(pet => `
         <li><strong>${pet.name}</strong> (${pet.type}) - Reported on ${pet.date}</li>
      `).join("");
   }
}
// ===== Back2You Enhancement =====

function previewImage(input, previewId) {
  const preview = document.getElementById(previewId);
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => preview.src = e.target.result;
    reader.readAsDataURL(input.files[0]);
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