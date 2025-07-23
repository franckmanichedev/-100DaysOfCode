document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const tabIndicator = document.querySelector('.tab-indicator');

    // Initialisation
    function initTabs() {
        const activeBtn = document.querySelector('.tab-btn.active');
        setIndicator(activeBtn);
    }

    // Positionner l'indicateur
    function setIndicator(btn) {
        const btnWidth = btn.offsetWidth;
        const btnLeft = btn.offsetLeft;
        
        tabIndicator.style.width = `${btnWidth}px`;
        tabIndicator.style.left = `${btnLeft}px`;
    }

    // Changer d'onglet
    function changeTab(btn) {
        // Retirer active de tous les boutons et panels
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        
        // Ajouter active au bouton cliqué
        btn.classList.add('active');
        
        // Afficher le panel correspondant
        const tabId = btn.getAttribute('data-tab');
        const tabPanel = document.getElementById(tabId);
        tabPanel.classList.add('active');
        
        // Mettre à jour l'indicateur
        setIndicator(btn);
    }

    // Écouteurs d'événements
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            changeTab(this);
        });
        
        // Accessibilité clavier
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                changeTab(this);
            }
        });
    });

    // Redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        const activeBtn = document.querySelector('.tab-btn.active');
        setIndicator(activeBtn);
    });

    // Initialiser les onglets
    initTabs();
});