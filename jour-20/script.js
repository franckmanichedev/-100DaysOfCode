// Services Modal Logic
const serviceCards = document.querySelectorAll('.service-card');
const modals = document.querySelectorAll('.modal');
const closeButtons = document.querySelectorAll('.modal-close');

serviceCards.forEach(card => {
    card.addEventListener('click', () => {
        const serviceId = card.getAttribute('data-service');
        const modal = document.getElementById(`${serviceId}-modal`);
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// Pricing Toggle Logic
const toggleOptions = document.querySelectorAll('.toggle-option');
const monthlyPrices = document.querySelectorAll('.monthly-price');
const yearlyPrices = document.querySelectorAll('.yearly-price');

toggleOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Update active class
        toggleOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        // Show/hide prices
        const period = option.getAttribute('data-period');
        
        if (period === 'monthly') {
            monthlyPrices.forEach(price => price.style.display = 'block');
            yearlyPrices.forEach(price => price.style.display = 'none');
        } else {
            monthlyPrices.forEach(price => price.style.display = 'none');
            yearlyPrices.forEach(price => price.style.display = 'block');
        }
    });
});