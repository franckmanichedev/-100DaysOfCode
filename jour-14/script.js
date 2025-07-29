document.addEventListener('DOMContentLoaded', function() {
    // Base de données de citations
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
            text: "Aimer, ce n'est pas se regarder l'un l'autre, c'est regarder ensemble dans la même direction.",
            author: "Antoine de Saint-Exupéry",
            category: "love"
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
            text: "On ne voit bien qu'avec le cœur. L'essentiel est invisible pour les yeux.",
            author: "Antoine de Saint-Exupéry",
            category: "love"
        },
        {
            text: "Le plus grand risque est de ne prendre aucun risque.",
            author: "Mark Zuckerberg",
            category: "success"
        },
        {
            text: "Au lieu de te d'interroger, teste et comtemple le resultat.",
            author: "Franck Maniche",
            category: "success"
        },
        {
            text: "La vie sans amour, c'est comme un arbre sans fleurs ni fruits.",
            author: "Khalil Gibran",
            category: "love"
        },
        {
            text: "L'imagination est plus importante que le savoir.",
            author: "Albert Einstein",
            category: "wisdom"
        }
    ];

    // Éléments DOM
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const newQuoteBtn = document.getElementById('new-quote');
    const copyQuoteBtn = document.getElementById('copy-quote');
    const tweetQuoteBtn = document.getElementById('tweet-quote');
    const notification = document.getElementById('notification');
    const quoteBox = document.querySelector('.quote-box');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    // Variables d'état
    let currentCategory = 'all';
    let currentQuote = null;
    
    // Fonction pour obtenir une citation aléatoire
    function getRandomQuote() {
        let filteredQuotes = quotes;
        
        // Filtrer par catégorie si nécessaire
        if (currentCategory !== 'all') {
            filteredQuotes = quotes.filter(quote => quote.category === currentCategory);
        }
        
        // S'assurer qu'on a des citations
        if (filteredQuotes.length === 0) {
            return {
                text: "Aucune citation disponible pour cette catégorie",
                author: "Système"
            };
        }
        
        // Sélectionner une citation aléatoire
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        return filteredQuotes[randomIndex];
    }
    
    // Fonction pour afficher une nouvelle citation avec animation
    function displayNewQuote() {
        // Animation de disparition
        quoteBox.classList.remove('fade-in');
        quoteBox.classList.add('fade-out');
        
        // Après l'animation de disparition, changer la citation et afficher
        setTimeout(() => {
            const newQuote = getRandomQuote();
            quoteText.textContent = newQuote.text;
            quoteAuthor.textContent = newQuote.author;
            currentQuote = newQuote;
            
            // Animation d'apparition
            quoteBox.classList.remove('fade-out');
            quoteBox.classList.add('fade-in');
        }, 500);
    }
    
    // Copier la citation dans le presse-papiers
    function copyToClipboard() {
        const textToCopy = `"${currentQuote.text}" - ${currentQuote.author}`;
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                // Afficher la notification
                notification.classList.add('show');
                
                // Cacher la notification après 3 secondes
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 3000);
            })
            .catch(err => {
                console.error('Erreur lors de la copie: ', err);
            });
    }
    
    // Tweeter la citation
    function tweetQuote() {
        const tweetText = encodeURIComponent(`"${currentQuote.text}" - ${currentQuote.author}`);
        const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
        window.open(tweetUrl, '_blank');
    }
    
    // Changer de catégorie
    function changeCategory(category) {
        currentCategory = category;
        
        // Mettre à jour les boutons actifs
        categoryBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });
        
        // Afficher une nouvelle citation
        displayNewQuote();
    }
    
    // Événements
    newQuoteBtn.addEventListener('click', displayNewQuote);
    copyQuoteBtn.addEventListener('click', copyToClipboard);
    tweetQuoteBtn.addEventListener('click', tweetQuote);
    
    // Événements pour les boutons de catégorie
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            changeCategory(btn.dataset.category);
        });
    });
    
    // Initialisation
    currentQuote = getRandomQuote();
    quoteText.textContent = currentQuote.text;
    quoteAuthor.textContent = currentQuote.author;
    quoteBox.classList.add('fade-in');
    
    // Ajouter une citation aléatoire toutes les 30 secondes
    setInterval(displayNewQuote, 30000);
});