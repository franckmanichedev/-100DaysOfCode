// Thème clair/sombre
document.querySelector(".theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Constants pour le compte à rebours
const second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24;

// Modifier la date cible ici
let countDown = new Date("Oct 21, 2025 00:00:00").getTime();

const updateCountdown = () => {
  const now = new Date().getTime();
  const distance = countDown - now;

  if (distance < 0) {
    clearInterval(interval);
    document.querySelector("main").innerHTML = "<h1>Le défi est terminé ! 🎉</h1>";
    return;
  }

  document.getElementById("jours").innerText = Math.floor(distance / day);
  document.getElementById("heures").innerText = Math.floor((distance % day) / hour);
  document.getElementById("minutes").innerText = Math.floor((distance % hour) / minute);
  document.getElementById("secondes").innerText = Math.floor((distance % minute) / second);
};

const interval = setInterval(updateCountdown, 1000);
updateCountdown(); // Lancer immédiatement au chargement
