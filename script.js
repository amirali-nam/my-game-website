const toggle = document.getElementById("toggle");
const body = document.body;

toggle.addEventListener("click", () => {
    body.classList.toggle("crysis-mode");
    body.classList.toggle("silent-mode");
});