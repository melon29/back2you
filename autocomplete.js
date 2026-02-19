// ============================================================
//  LOCATIONIQ AUTOCOMPLETE
//  Replace YOUR_LOCATIONIQ_API_KEY with your actual key from
//  https://locationiq.com (free signup, no billing needed)
// ============================================================

const LOCATIONIQ_KEY = "pk.821e25d91a15018adcf5ad31ee22fa3a";

// Debounce helper — prevents firing on every single keypress
function debounce(fn, delay) {
   let timer;
   return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
   };
}

/**
 * Attaches LocationIQ autocomplete to an input + dropdown pair.
 * @param {string} inputId     - ID of the text input
 * @param {string} dropdownId  - ID of the <ul> dropdown element
 * @param {Function} onSelect  - Callback when user picks a suggestion: (displayName) => {}
 */
function attachAutocomplete(inputId, dropdownId, onSelect) {
   const input = document.getElementById(inputId);
   const dropdown = document.getElementById(dropdownId);
   
   if (!input || !dropdown) return;
   
   const fetchSuggestions = debounce(async (query) => {
      if (query.length < 3) {
         dropdown.innerHTML = "";
         dropdown.style.display = "none";
         return;
      }
      
      try {
         // Restrict results to India (countrycodes=in)
         const url = `https://us1.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_KEY}&q=${encodeURIComponent(query)}&countrycodes=in&limit=6&format=json`;
         const res = await fetch(url);
         const data = await res.json();
         
         dropdown.innerHTML = "";
         
         if (!Array.isArray(data) || data.length === 0) {
            dropdown.style.display = "none";
            return;
         }
         
         data.forEach(place => {
            // Build a clean short display name
            const parts = place.display_name.split(",");
            // Show first 3 parts max to keep it readable e.g. "Viviana Mall, Thane, Maharashtra"
            const shortName = parts.slice(0, 3).map(p => p.trim()).join(", ");
            
            const li = document.createElement("li");
            li.className = "autocomplete-item";
            li.textContent = shortName;
            li.addEventListener("mousedown", (e) => {
               e.preventDefault(); // prevent input blur before click fires
               input.value = shortName;
               dropdown.innerHTML = "";
               dropdown.style.display = "none";
               if (onSelect) onSelect(shortName);
            });
            dropdown.appendChild(li);
         });
         
         dropdown.style.display = "block";
         
      } catch (err) {
         console.error("LocationIQ error:", err);
         dropdown.style.display = "none";
      }
   }, 350);
   
   input.addEventListener("input", () => fetchSuggestions(input.value.trim()));
   
   // Hide dropdown when input loses focus
   input.addEventListener("blur", () => {
      setTimeout(() => {
         dropdown.style.display = "none";
      }, 150);
   });
   
   input.addEventListener("focus", () => {
      if (dropdown.children.length > 0) dropdown.style.display = "block";
   });
}

/**
 * Call this once after each page load to attach autocomplete
 * to whichever inputs exist on the current page.
 */
function initAutocomplete() {
   
   // --- REPORT FORM: Lost pet location ---
   attachAutocomplete("lost-location-input", "lost-location-dropdown");
   
   // --- REPORT FORM: Found pet location ---
   attachAutocomplete("found-location-input", "found-location-dropdown");
   
   // --- FILTER SIDEBAR: location filter (lost & found pages share same ID) ---
   attachAutocomplete("lost-pet-filter-location", "filter-location-dropdown", () => {
      // Trigger filter re-apply when user picks a suggestion
      if (typeof applyLostPetFilters === "function") applyLostPetFilters();
   });
}