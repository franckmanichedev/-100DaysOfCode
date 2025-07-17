const themeToggle = document.getElementById("theme-toggle");
const html = document.documentElement;

// Vérifie le localStorage ou la préférence système
const savedTheme = localStorage.getItem("theme") || 
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
html.setAttribute("data-theme", savedTheme);

// Met à jour l'icône
updateIcon(savedTheme);

// Bascule entre light/dark
themeToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateIcon(newTheme);
});

// Ajoute une transition CSS pour le changement de thème
html.classList.add("theme-transition");
setTimeout(() => {
    html.classList.remove("theme-transition");
}, 300);

// Change l'icône 🌙 / ☀️
function updateIcon(theme) {
    themeToggle.textContent = theme === "light" ? "🌙" : "☀️";
}