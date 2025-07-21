document.addEventListener('DOMContentLoaded', function() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    let autoSlideInterval;

    // Afficher le témoignage initial
    showTestimonial(currentIndex);

    // Configuration du défilement automatique
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            nextTestimonial();
        }, 5000);
    }

    // Démarrer le défilement automatique
    startAutoSlide();

    // Arrêter le défilement automatique quand l'utilisateur interagit
    function pauseAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Afficher un témoignage spécifique
    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }

    // Témoignage suivant
    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }

    // Témoignage précédent
    function prevTestimonial() {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentIndex);
    }

    // Événements
    nextBtn.addEventListener('click', () => {
        nextTestimonial();
        pauseAutoSlide();
        startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        prevTestimonial();
        pauseAutoSlide();
        startAutoSlide();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            showTestimonial(index);
            pauseAutoSlide();
            startAutoSlide();
        });
    });

    // Pause au survol
    document.querySelector('.testimonial-container').addEventListener('mouseenter', pauseAutoSlide);
    document.querySelector('.testimonial-container').addEventListener('mouseleave', startAutoSlide);

    // Accessibilité clavier
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            nextTestimonial();
            pauseAutoSlide();
            startAutoSlide();
        } else if (e.key === 'ArrowLeft') {
            prevTestimonial();
            pauseAutoSlide();
            startAutoSlide();
        }
    });
});