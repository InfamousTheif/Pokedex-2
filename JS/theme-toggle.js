const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-label");
const themeChoices = document.querySelector(".theme-choices");
const pokemonWrapper = document.querySelector(".pokemon-wrapper_div");
const regionSelect = document.querySelector(".dropdown-region_select");

themeToggle.addEventListener("click", () => {
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
  const themeValue = e.target.dataset.theme;
  document.body.style.colorScheme = themeValue;
})
