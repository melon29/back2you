// ===============================
// LOST & FOUND PET SYSTEM
// ===============================

document.addEventListener("DOMContentLoaded", function () {

  // ===============================
  // GET FORMS
  // ===============================
  const lostForm = document.getElementById("lost-pet-form");
  const foundForm = document.getElementById("found-pet-form");
  const allPetsContainer = document.getElementById("allPetsContainer");

  // ===============================
  // HANDLE LOST PET FORM
  // ===============================
  if (lostForm) {
    lostForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(lostForm);
      const pet = createPetObject(formData, "Lost");

      savePet(pet);
      alert("Lost Pet Report Submitted Successfully!");
      lostForm.reset();
    });
  }

  // ===============================
  // HANDLE FOUND PET FORM
  // ===============================
  if (foundForm) {
    foundForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(foundForm);
      const pet = createPetObject(formData, "Found");

      savePet(pet);
      alert("Found Pet Report Submitted Successfully!");
      foundForm.reset();
    });
  }

  // ===============================
  // CREATE PET OBJECT
  // ===============================
  function createPetObject(formData, status) {
    return {
      id: Date.now(),
      name: formData.get("pet_name") || "Unknown",
      gender: formData.get("gender") || "Unknown",
      type: formData.get("animal_type") || "Unknown",
      breed: formData.get("breed") || "Unknown",
      location: formData.get("location") || "Unknown",
      landmark: formData.get("landmark") || "",
      date: formData.get("date") || "",
      description: formData.get("description") || "",
      status: status
    };
  }

  // ===============================
  // SAVE TO LOCAL STORAGE
  // ===============================
  function savePet(pet) {
    let pets = [];

    try {
      pets = JSON.parse(localStorage.getItem("pets")) || [];
    } catch (error) {
      pets = [];
    }

    pets.push(pet);
    localStorage.setItem("pets", JSON.stringify(pets));
  }

  // ===============================
  // RENDER ALL PETS (All Pets Page)
  // ===============================
  if (allPetsContainer) {
    renderAllPets();
  }

  function renderAllPets() {
    allPetsContainer.innerHTML = "";

    let pets = [];

    try {
      pets = JSON.parse(localStorage.getItem("pets")) || [];
    } catch (error) {
      pets = [];
    }

    if (pets.length === 0) {
      allPetsContainer.innerHTML = "<p>No pets reported yet.</p>";
      return;
    }

    pets.forEach(pet => {
      const card = document.createElement("div");
      card.className = "pet-card";

      card.innerHTML = `
        <h3>${pet.name}</h3>
        <p><strong>Status:</strong> ${pet.status}</p>
        <p><strong>Type:</strong> ${pet.type}</p>
        <p><strong>Gender:</strong> ${pet.gender}</p>
        <p><strong>Breed:</strong> ${pet.breed}</p>
        <p><strong>Location:</strong> ${pet.location}</p>
        <p><strong>Date:</strong> ${pet.date}</p>
        <p>${pet.description}</p>
      `;

      allPetsContainer.appendChild(card);
    });
  }

});