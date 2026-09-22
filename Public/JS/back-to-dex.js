const backToDex = document.querySelector(".back_button");

// testing out the history api
export function goToDex() {
  backToDex.addEventListener("click", () => {
    history.back(-history.length);
  });
}