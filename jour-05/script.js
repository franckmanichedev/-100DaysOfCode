
// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

themeToggle.addEventListener('click', () => {
	const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
	html.setAttribute('data-theme', newTheme);
	localStorage.setItem('theme', newTheme);
	themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
});

// Initialisation du thème
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'light' ? '🌙' : '☀️';

// Animation des formulaires
document.getElementById('signUp').addEventListener('click', () => {
  	document.getElementById('container').classList.add('right-panel-active');
});

document.getElementById('signIn').addEventListener('click', () => {
  	document.getElementById('container').classList.remove('right-panel-active');
});

// Validation des champs
document.querySelectorAll('input').forEach(input => {
	input.addEventListener('blur', (e) => {
		if (e.target.value.trim() === '') {
			e.target.style.borderColor = 'var(--error)';
		} else {
			e.target.style.borderColor = '';
		}
	});
});

// Gestion des tabs (mobile)
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

const overlay = document.querySelector('.overlay');
overlay.style.display = 'none'; // Hide overlay by default

tabLogin.addEventListener('click', () => {
	tabLogin.classList.add('active');
	tabRegister.classList.remove('active');
	loginForm.classList.add('active');
	registerForm.classList.remove('active');
});

tabRegister.addEventListener('click', () => {
	tabRegister.classList.add('active');
	tabLogin.classList.remove('active');
	registerForm.classList.add('active');
	loginForm.classList.remove('active');
});

// Initialisation
window.addEventListener('DOMContentLoaded', () => {
	if (window.innerWidth <= 768) {
		loginForm.classList.add('active');
	}
});