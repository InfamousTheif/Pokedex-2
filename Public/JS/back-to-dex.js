const backToDex = document.querySelector(".back_button");

// testing out the history api
function goToDex() {
  backToDex.addEventListener("click", () => {
    history.back(-history.length);
  });
}