// --- DEMO DATA ---
const lostPets = [];
const foundPets = [];

// --- DATA ACCESS ---

function getUserReports() {
    return JSON.parse(localStorage.getItem("petReports")) || [];
}

function saveUserReports(reports) {
    localStorage.setItem("petReports", JSON.stringify(reports));
}

function getAllPetsByCategory(category) {
    const demoPets = category === "lost" ? lostPets : foundPets;
    const userReports = getUserReports().filter(p => p.category === category);
    return [...demoPets, ...userReports];
}

// --- FILTER HELPERS ---

function getSelectedRadioValue(name) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : "All";
}

// --- RENDERING ---

function renderLostPets(pets, category) {
    const container = document.getElementById("lost-pets-card-container");
    if (!container) return;
    container.innerHTML = "";

    if (pets.length === 0) {
        container.innerHTML = `<p style="padding: 20px; color: #666;">No ${category} pets found matching your filters.</p>`;
        return;
    }

    pets.forEach(pet => {
        const card = document.createElement("div");
        card.className = "lost-pets-card";

        card.innerHTML = `
            <div class="lost-pets-card-img">
                <img src="${pet.image}" alt="${pet.name}" onerror="this.src='rr1.jpg'">
            </div>
            <div class="lost-pets-card-text">
                <span class="lost-pet-name">${pet.name}</span>
                <span class="lost-pet-gender">${pet.gender} <span class="lost-pet-type">${pet.type}</span></span>
                <span class="lost-pet-breed">${pet.breed || "Unknown breed"}</span>
                <hr />
                <span class="lost-pet-loc">${pet.location}</span>
                <span class="lost-pet-date">${pet.date}</span>
                <button class="lost-pet-btn">View More</button>
            </div>`;

        container.appendChild(card);
        card.querySelector(".lost-pet-btn").addEventListener("click", () => showPetModal(pet));
    });
}

// --- FILTERS ---

function applyLostPetFilters() {
    const h1Element = document.getElementById("lost-pets-h1");
    if (!h1Element) return;

    const isFoundPage = h1Element.innerText.toLowerCase().includes("found");
    const category = isFoundPage ? "found" : "lost";

    const allPets = getAllPetsByCategory(category);

    const nameFilter = document.getElementById("lost-pet-filter-name").value.toLowerCase().trim();
    const typeFilter = getSelectedRadioValue("lost-pet-filter-type");
    const genderFilter = getSelectedRadioValue("lost-pet-filter-gender");
    const locationFilter = document.getElementById("lost-pet-filter-location").value.toLowerCase().trim();

    const filtered = allPets.filter(pet => {
        const matchName = pet.name.toLowerCase().includes(nameFilter);
        const matchType = typeFilter === "All" || pet.type === typeFilter;
        const matchGender = genderFilter === "All" || pet.gender === genderFilter;
        const matchLocation = locationFilter === "" || pet.location.toLowerCase().includes(locationFilter);
        return matchName && matchType && matchGender && matchLocation;
    });

    renderLostPets(filtered, category);
}

function initLostPets() {
    applyLostPetFilters();

    const nameInput = document.getElementById("lost-pet-filter-name");
    if (nameInput) nameInput.addEventListener("input", applyLostPetFilters);

    document.querySelectorAll('input[name="lost-pet-filter-type"]').forEach(r =>
        r.addEventListener("change", applyLostPetFilters)
    );

    document.querySelectorAll('input[name="lost-pet-filter-gender"]').forEach(r =>
        r.addEventListener("change", applyLostPetFilters)
    );

    const locInput = document.getElementById("lost-pet-filter-location");
    if (locInput) locInput.addEventListener("input", applyLostPetFilters);
}

// --- REPORT PAGE ---

function initReportPage() {
    const lostForm = document.getElementById("lost-pet-form");
    const foundForm = document.getElementById("found-pet-form");

    function handleFormSubmit(form, category) {
        if (!form) return;

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const formData = new FormData(form);
            const imageFile = formData.get("image");

            function saveReport(imageDataUrl) {
                const newPet = {
                    id: "user_" + Date.now(),
                    category: category,
                    name: formData.get("pet_name") || "Unknown",
                    gender: capitalizeFirst(formData.get("gender") || "Unknown"),
                    type: capitalizeFirst(formData.get("animal_type")),
                    breed: formData.get("breed") || "Unknown",
                    location: formData.get("location"),
                    date: formatDate(formData.get("date")),
                    description: formData.get("description"),
                    image: imageDataUrl || "rr1.jpg",
                    reportedBy: localStorage.getItem("loggedInUser"),
                    reportedAt: new Date().toISOString()
                };

                let reports = getUserReports();
                reports.push(newPet);
                saveUserReports(reports);

                alert("Pet reported successfully!");
                loadPage(category + "pets");
            }

            if (imageFile && imageFile.size > 0) {
                const reader = new FileReader();
                reader.onload = e => saveReport(e.target.result);
                reader.readAsDataURL(imageFile);
            } else {
                saveReport(null);
            }
        });
    }

    handleFormSubmit(lostForm, "lost");
    handleFormSubmit(foundForm, "found");
}

// --- MODAL ---

function showPetModal(pet) {
    const modal = document.getElementById("lost-pet-info-div");
    const modalBody = document.getElementById("lost-pet-modal-body");
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
        <div class="lost-pet-modal-img">
            <img src="${pet.image}" alt="${pet.name}" onerror="this.src='rr1.jpg'">
        </div>
        <div class="lost-pet-modal-text">
            <h2>${pet.name}</h2>
            <span><strong>Gender:</strong> ${pet.gender}</span>
            <span><strong>Type:</strong> ${pet.type}</span>
            <span><strong>Breed:</strong> ${pet.breed}</span>
            <span><strong>Location:</strong> ${pet.location}</span>
            <span><strong>Date:</strong> ${pet.date}</span>
            <span><strong>Description:</strong> ${pet.description}</span>
        </div>
    `;

    modal.style.display = "flex";
}

// --- UTILS ---

function capitalizeFirst(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
}