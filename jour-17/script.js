document.addEventListener('DOMContentLoaded', function() {
    const accordion = document.querySelector('.faq-accordion');
    const questions = document.querySelectorAll('.faq-question');
    const isSingleOpen = accordion.classList.contains('single-open');
    
    questions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isOpen = this.classList.contains('active');
            
            // Fermer toutes les autres réponses si single-open
            if (isSingleOpen && !isOpen) {
                questions.forEach(q => {
                    if (q !== this && q.classList.contains('active')) {
                        q.classList.remove('active');
                        q.nextElementSibling.style.maxHeight = null;
                    }
                });
            }
            
            // Basculer l'état actuel
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = null;
            }
        });
    });
    
    // Ouvrir la première question par défaut si souhaité
    // questions[0].click();
});