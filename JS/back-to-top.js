const backToTop = document.querySelector("#back-to-top");

export function displayTopButton() {
  window.addEventListener("scroll", () => {
    if(window.scrollY > 200) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  })
}