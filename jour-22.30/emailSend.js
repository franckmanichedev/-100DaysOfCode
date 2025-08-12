const counters = document.querySelectorAll('.counter');
const speed = 200; // vitesse (plus petit = plus rapide)

const animateCounters = () => {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const updateCount = () => {
            const count = +counter.innerText;
            const increment = target / speed;
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
};

    // Déclencher seulement quand visible à l'écran
    let statsSection = document.querySelector('#stats');
    let statsTriggered = false;
    window.addEventListener('scroll', () => {
        let sectionTop = statsSection.getBoundingClientRect().top;
        let windowHeight = window.innerHeight;
        if (sectionTop < windowHeight && !statsTriggered) {
            animateCounters();
            statsTriggered = true;
        }
    });
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbarCollapse = document.getElementById('navbarNav');

    // Gestion du scroll
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Gestion du menu burger
    mobileMenuBtn.addEventListener('click', () => {
        header.classList.toggle('menu-open');
    });

    // Fermer le menu quand on clique sur un lien (mobile)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) {
                header.classList.remove('menu-open');
                navbarCollapse.classList.remove('show');
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    /* ========= Formulaire de contact ======== */
    const form = document.getElementById('contact-form');
    const loadingIndicator = document.getElementById('loading-indicator');
    const message = document.querySelector('.message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Afficher le loader
        loadingIndicator.style.display = 'flex';
        message.style.display = 'none'; // Cache les messages précédents

        try {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const comment = document.getElementById('comment').value.trim();

            // Validation
            if (!name || !email || !subject || !comment) {
                throw new Error("Veuillez remplir tous les champs.");
            }

            if (!isValidEmail(email)) {
                throw new Error("Veuillez entrer une adresse email valide.");
            }

            // Envoi avec EmailJS
            await emailjs.send("service_a2pfcjj", "template_vvthopg", {
                from_name: name,
                from_email: email,
                subject: subject,
                message: comment
            });

            showSuccess("Votre message a bien été envoyé !");
            form.reset();
        } catch (error) {
            showError(error.message || "Erreur lors de l'envoi du message.");
            console.error('Erreur:', error);
        } finally {
            // Cacher le loader dans tous les cas
            loadingIndicator.style.display = 'none';
        }
    });

    function showSuccess(msg) {
        message.textContent = msg;
        message.style.color = 'green';
        message.style.display = 'block';
        setTimeout(() => message.style.display = 'none', 5000);
    }

    function showError(msg) {
        message.textContent = msg;
        message.style.color = 'red';
        message.style.display = 'block';
        setTimeout(() => message.style.display = 'none', 5000);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});