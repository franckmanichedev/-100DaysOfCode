document.addEventListener('', function() {
    // Citations 
    const quotes = [
        {
            text: "La vie est ce qui arrive quand on est occupé à faire d'autres projets.",
            author: "John Lennon",
            category: "life"
        },
        {
            text: "Le succès n'est pas final, l'échec n'est pas fatal : c'est le courage de continuer qui compte.",
            author: "Winston Churchill",
            category: "success"
        },
        {
            text: "Sois le changement que tu veux voir dans le monde.",
            author: "Mahatma Gandhi",
            category: "wisdom"
        },
        {
            text: "La seule façon de faire du bon travail est d'aimer ce que vous faites.",
            author: "Steve Jobs",
            category: "success"
        },
        {
            text: "L'éducation est l'arme la plus puissante qu'on puisse utiliser pour changer le monde.",
            author: "Nelson Mandela",
            category: "wisdom"
        },
        {
            text: "La vie est un mystère qu'il faut vivre, et non un problème à résoudre.",
            author: "Gandhi",
            category: "life"
        },
        {
            text: "Le bonheur n'est pas quelque chose de prêt à l'emploi. Il vient de vos propres actions.",
            author: "Dalaï Lama",
            category: "wisdom"
        },
        {
            text: "Le courage n'est pas l'absence de peur, mais la capacité de vaincre ce qui fait peur.",
            author: "Nelson Mandela",
            category: "success"
        },
        {
            text: "La simplicité est la sophistication suprême.",
            author: "Léonard de Vinci",
            category: "wisdom"
        },
        {
            text: "La meilleure façon de prédire l'avenir est de le créer.",
            author: "Peter Drucker",
            category: "success"
        },
        {
            text: "Le plus grand risque est de ne prendre aucun risque.",
            author: "Mark Zuckerberg",
            category: "success"
        },
        {
            text: "Au lieu de te d'interroger, teste et contemple le resultat.",
            author: "Franck Maniche",
            category: "success"
        },
        {
            text: "L'imagination est plus importante que le savoir.",
            author: "Albert Einstein",
            category: "wisdom"
        }
    ];

    // Éléments du DOM
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const quoteBox = document.querySelector('.quote-box');
    const newQuoteBtn = document.getElementById('new-quote');
    const copyQuoteBtn = document.getElementById('copy-quote');
    const notification = document.getElementById('notification');

    // Variables d'état
    let currentQuote;
    let isTyping = false;
    let typingTimeout;
    let quoteInterval;

    // Effet machine à écrire
    function typeWriter(text, element, speed, callback) {
        let i = 0;
        isTyping = true;
        element.textContent = '';
        element.classList.add('typing'); // Ajoute la classe pour le curseur
        
        function typing() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                typingTimeout = setTimeout(typing, speed);
            } else {
                isTyping = false;
                element.classList.remove('typing'); // Retire la classe du curseur
                if (callback) callback();
            }
        }
        
        typing();
    }

    // Obtenir une citation aléatoire
    function getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    }

    // Afficher une nouvelle citation avec animation
    function displayNewQuote() {
        if (isTyping) {
            clearTimeout(typingTimeout);
            isTyping = false;
            quoteText.classList.remove('typing');
            quoteAuthor.classList.remove('typing');
        }
        
        // Animation de disparition
        quoteBox.classList.remove('fade-in');
        quoteBox.classList.add('fade-out');
        
        // Après l'animation, afficher la nouvelle citation
        setTimeout(() => {
            const newQuote = getRandomQuote();
            currentQuote = newQuote;
            
            // Effacer le contenu
            quoteText.textContent = '';
            quoteAuthor.textContent = '';
            
            // Animation d'apparition
            quoteBox.classList.remove('fade-out');
            quoteBox.classList.add('fade-in');
            
            // Taper la citation
            typeWriter(`"${newQuote.text}"`, quoteText, 30, () => {
                // Taper l'auteur après un court délai
                setTimeout(() => {
                    typeWriter(newQuote.author, quoteAuthor, 50);
                }, 300);
            });
        }, 500);
    }

    // Copier la citation dans le presse-papier
    function copyToClipboard() {
        if (!currentQuote || isTyping) return;
        
        const textToCopy = `"${currentQuote.text}" - ${currentQuote.author}`;
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                if (notification) {
                    notification.classList.add('show');
                    setTimeout(() => {
                        notification.classList.remove('show');
                    }, 3000);
                }
            })
            .catch(err => {
                console.error('Erreur lors de la copie: ', err);
            });
    }

    // Événements
    if (newQuoteBtn) {
        newQuoteBtn.addEventListener('click', displayNewQuote);
    }
    
    if (copyQuoteBtn) {
        copyQuoteBtn.addEventListener('click', copyToClipboard);
    }

    // Initialisation
    currentQuote = getRandomQuote();
    typeWriter(`"${currentQuote.text}"`, quoteText, 30, () => {
        setTimeout(() => {
            typeWriter(currentQuote.author, quoteAuthor, 50);
        }, 300);
    });
    
    // Changer de citation toutes les 30 secondes
    quoteInterval = setInterval(displayNewQuote, 30000);

    // Gestion de la navbar sticky
    let header = document.querySelector('header');
    if (header) {
        header.classList.toggle('sticky', window.scrollY > 100);
        
        window.addEventListener('scroll', () => {
            header.classList.toggle('sticky', window.scrollY > 100);
        });
    }

    // Gestion des liens de navigation
    let sections = document.querySelectorAll('section');
    let navLinks = document.querySelectorAll('header nav a');
    
    if (sections.length && navLinks.length) {
        window.addEventListener('scroll', () => {
            sections.forEach(sec => {
                let top = window.scrollY;
                let offset = sec.offsetTop - 100;
                let height = sec.offsetHeight;
                let id = sec.getAttribute('id');
                
                if (top >= offset && top < offset + height) {
                    navLinks.forEach(links => {
                        links.classList.remove('active');
                        document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
                    });
                }
            });
        });
    }
});
// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }

    animateTimelineItems();
    animateSkillItems();
    animateProgressBars();
});

    // Animation for timeline items
function animateTimelineItems() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        const itemPosition = item.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (itemPosition < screenPosition) {
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 200);
        }
    });
}

/*========== dark light mode ==========*/
let darkModeIconDesktop = document.querySelector('#darkMode-icon');
let darkModeIconMobile = document.querySelector('#darkMode-icon-mobile');

// theme toggle variables
const themeBtn = document.querySelectorAll('.theme-btn');

// Fonction pour basculer entre les thèmes
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');

    themeBtn.forEach((btn) => {
        btn.classList.toggle('light');
        btn.classList.toggle('dark');
    });
    // Enregistrer le thème dans le stockage local
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Verifier si le mode sombre est active au chargement de la page
if(localStorage.getItem('theme') === 'dark'){
    document.body.classList.add('dark-theme');
    themeBtn.forEach((btn) => {
        btn.classList.add('dark');
        btn.classList.remove('light');
    });
}

// Ajouter un écouteur d'événement pour le bouton de changement de thème
if(darkModeIconDesktop){
    darkModeIconDesktop.addEventListener('click', toggleTheme);
}
if(darkModeIconMobile){
    darkModeIconMobile.addEventListener('click', toggleTheme);
}

/*========== Noir/Blanc ==========*/
document.getElementById('highContrastToggle').addEventListener('click', function() {
    document.documentElement.classList.toggle('high-contrast');
    
    // Sauvegarde le choix dans localStorage
    if (document.documentElement.classList.contains('high-contrast')) {
        localStorage.setItem('highContrastMode', 'enabled');
        this.innerHTML = '<i class="fas fa-adjust"></i>';
    } else {
        localStorage.setItem('highContrastMode', 'disabled');
        this.innerHTML = '<i class="fas fa-adjust"></i>';
    }
});

// Vérifie au chargement si le mode était activé
if (localStorage.getItem('highContrastMode') === 'enabled') {
    document.documentElement.classList.add('high-contrast');
    document.getElementById('highContrastToggle').innerHTML = '<i class="fas fa-adjust"></i> Contraste normal';
}

/*====== Scroll To Top & ProgressBar & Welcome Animation ======*/
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'flex';
        scrollToTopBtn.style.alignItems = 'center';
        scrollToTopBtn.style.justifyContent = 'center';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ProgressBar
const progressBar = document.getElementById('progressBar');
const scrollPercentage = document.getElementById('scrollPercentage');

window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    const rounded = Math.round(scrolled);
    
    scrollPercentage.textContent = `${rounded}%`;
    
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'flex';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
    
    // Changement de couleur en fonction du pourcentage
    if (rounded > 70) {
        scrollToTopBtn.style.backgroundColor = 'var(--danger)';
    } else if (rounded > 30) {
        scrollToTopBtn.style.backgroundColor = 'var(--warning)';
    } else {
        scrollToTopBtn.style.backgroundColor = 'var(--primary)';
    }
});

// Welcome Animation
document.addEventListener('', () => {
    const welcomeAnimation = document.getElementById('welcomeAnimation');
    
    // Affiche l'animation pendant 2 secondes
    setTimeout(() => {
        welcomeAnimation.classList.add('animate-welcome-out');
        
        // Supprime complètement après l'animation
        setTimeout(() => {
            welcomeAnimation.remove();
        }, 500);
    }, 2000);
});

/*====== Animation for skill items ======*/
function animateSkillItems() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach((item, index) => {
        const itemPosition = item.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (itemPosition < screenPosition) {
            setTimeout(() => {
                item.classList.add('visible');
            // Animate progress circles
                const circles = item.querySelectorAll('.skill-circle-progress');
                circles.forEach(circle => {
                    const style = circle.getAttribute('style');
                    circle.setAttribute('style', style);
                });
            }, index * 100);
        }
    });
}

// Animate progress bars for skill categories
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.skill-category-progress-bar');
    
    progressBars.forEach(bar => {
        const itemPosition = bar.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (itemPosition < screenPosition) {
            const width = bar.style.width;
            bar.style.width = '0';
            // bar.style.width = width;
            setTimeout(() => {
                // bar.style.width = '0';
                bar.style.width = width;
            }, 100);
        }
    });
}

// Initialize animations on load
window.addEventListener('load', () => {
    animateTimelineItems();
    animateSkillItems();
    animateProgressBars();
});

// Latest-Project
document.addEventListener('', function() {
    const carousel = document.querySelector('.testimonial-carousel');
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    let autoSlideInterval;

    function updateCarousel() {
        // Retirer toutes les classes active
        cards.forEach(card => {
            card.classList.remove('active');
            card.style.pointerEvents = 'none'; // Désactive les interactions pendant la transition
        });
        
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Activer la carte courante
        cards[currentIndex].classList.add('active');
        setTimeout(() => {
            cards[currentIndex].style.pointerEvents = 'auto'; // Réactive les interactions
        }, 600); // Après la durée de la transition
        
        dots[currentIndex].classList.add('active');
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
        resetAutoSlide();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
        resetAutoSlide();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel();
        resetAutoSlide();
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Événements (identique)
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            goToSlide(parseInt(this.getAttribute('data-index')));
        });
    });

    // Initialisation
    updateCarousel();
    startAutoSlide();
    
    // Pause au survol
    carousel.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    carousel.addEventListener('mouseleave', startAutoSlide);
});

document.addEventListener('', function() {
    // Initialisation des tooltips Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Filtrage des projets
    const filterButtons = document.querySelectorAll('[data-filter]');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Mise à jour des boutons actifs
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Filtrage des projets
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hide');
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });
});

// Footer Accordeon
document.addEventListener('DOMContentLoaded', function() {
    // Sélectionne tous les accordéons
    const accordions = document.querySelectorAll('.mobile-accordion');
    
    // Ajoute le click handler seulement sur mobile
    function setupAccordions() {
        if (window.innerWidth < 768) {
            accordions.forEach(accordion => {
                accordion.addEventListener('click', function() {
                    this.classList.toggle('active');
                    
                    // Ferme les autres accordéons
                    accordions.forEach(otherAccordion => {
                        if (otherAccordion !== this) {
                            otherAccordion.classList.remove('active');
                        }
                    });
                });
            });
        } else {
            // Sur desktop, on désactive le comportement accordéon
            accordions.forEach(accordion => {
                accordion.classList.remove('active');
                accordion.removeEventListener('click');
            });
        }
    }
    
    // Initial setup
    setupAccordions();
    
    // Re-setup quand la fenêtre est redimensionnée
    window.addEventListener('resize', setupAccordions);
});