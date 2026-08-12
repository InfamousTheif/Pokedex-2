const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-label");
const themeChoices = document.querySelector(".theme-choices");
const pokemonWrapper = document.querySelector(".pokemon-wrapper_div");
const regionSelect = document.querySelector(".dropdown-region_select");

document.addEventListener("click", (e) => {
  const isThemeToggle = themeToggle.contains(e.target);
  const isThemeChoices = themeChoices.contains(e.target);
  console.log("toggle:", !isThemeToggle, "choices:", !isThemeChoices);

  if(!isThemeToggle && !isThemeChoices) {
    themeChoices.classList.add("hide");
    themeToggle.setAttribute("aria-expanded", "false");
    themeToggle.setAttribute("aria-label", "open theme menu");
  }
});

themeToggle.addEventListener("click", (e) => {
  e.stopPropagation;

  if(themeChoices.classList.contains("hide")) {
    themeChoices.classList.remove("hide");
    themeToggle.setAttribute("aria-expanded", "true");
    themeToggle.setAttribute("aria-label", "close theme menu");
  } else {
    themeChoices.classList.add("hide");
    themeToggle.setAttribute("aria-expanded", "false");
    themeToggle.setAttribute("aria-label", "open theme menu");
  }
});

themeChoices.addEventListener("click", (e) => {
  e.stopPropagation;

  const themeValue = e.target.dataset.theme;
  document.body.style.colorScheme = themeValue;
})
