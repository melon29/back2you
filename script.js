// ===== LOST PET FORM =====
document.addEventListener("DOMContentLoaded", function () {

  const lostForm = document.getElementById("lost-pet-form");
  const foundForm = document.getElementById("found-pet-form");

  if (lostForm) {
    lostForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(lostForm);

      const pet = {
        name: formData.get("pet_name"),
        gender: formData.get("gender"),
        type: formData.get("animal_type"),
        breed: formData.get("breed"),
        location: formData.get("location"),
        landmark: formData.get("landmark"),
        date: formData.get("date"),
        description: formData.get("description"),
        status: "Lost"
      };

      savePet(pet);
      alert("Lost Pet Report Submitted!");
      lostForm.reset();
    });
  }

  if (foundForm) {
    foundForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(foundForm);

      const pet = {
        name: formData.get("pet_name") || "Unknown",
        gender: formData.get("gender"),
        type: formData.get("animal_type"),
        breed: formData.get("breed"),
        location: formData.get("location"),
        landmark: formData.get("landmark"),
        date: formData.get("date"),
        description: formData.get("description"),
        status: "Found"
      };

      savePet(pet);
      alert("Found Pet Report Submitted!");
      foundForm.reset();
    });
  }

  function savePet(pet) {
    let pets = JSON.parse(localStorage.getItem("pets")) || [];
    pets.push(pet);
    localStorage.setItem("pets", JSON.stringify(pets));
  }

});