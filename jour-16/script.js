class Modal {
    constructor(options = {}) {
        // Options par défaut
        this.defaults = {
            title: 'Titre de la Modale',
            content: 'Contenu de la modale',
            showClose: true,
            showFooter: true,
            confirmText: 'Confirmer',
            cancelText: 'Annuler',
            onConfirm: () => {},
            onCancel: () => {}
        };

        // Fusion des options
        this.options = { ...this.defaults, ...options };

        // Créer la modale
        this.createModal();
    }

    createModal() {
        // Clone le template
        const template = document.getElementById('modalTemplate');
        this.modal = template.content.cloneNode(true).querySelector('.modal-overlay');

        // Remplir les données
        this.modal.querySelector('[data-modal-title]').textContent = this.options.title;
        this.modal.querySelector('[data-modal-body]').innerHTML = this.options.content;

        // Configurer les boutons
        const confirmBtn = this.modal.querySelector('[data-modal-confirm]');
        const cancelBtn = this.modal.querySelector('[data-modal-close]');

        if (confirmBtn) {
            confirmBtn.textContent = this.options.confirmText;
            confirmBtn.addEventListener('click', () => {
                this.options.onConfirm();
                this.close();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.options.onCancel();
                this.close();
            });
        }

        // Gérer la fermeture au clic sur l'overlay
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Ajouter au DOM
        document.body.appendChild(this.modal);
    }

    open() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';

        // Supprimer la modale après l'animation
        setTimeout(() => {
            if (this.modal && this.modal.parentNode) {
                this.modal.parentNode.removeChild(this.modal);
            }
        }, 300);
    }
}

// Initialisation des modales via data-attributes
document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-modal-open');
        
        // Configuration différente selon la modale demandée
        let options = {
            title: `#Day16 ${modalId}`,
            content: `Ceci est le contenu de la modale ${modalId}`
        };

        if (modalId === 'modal2') {
            options = {
                title: '#Day16 Spéciale',
                content: '<p>Cette modale a un contenu différent.</p><ul><li>Item 1</li><li>Item 2</li></ul>',
                confirmText: 'Accepter',
                cancelText: 'Refuser'
            };
        }

        if (modalId === 'modal3') {
            options = {
                title: '#Day16 Personnalisée',
                content: `
                    <h3>Contenu HTML personnalisé</h3>
                    <p>Vous pouvez mettre <strong>n'importe quel</strong> contenu HTML ici.</p>
                    <form>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px;">Nom:</label>
                            <input type="text" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
                        </div>
                    </form>
                `,
                onConfirm: () => {
                    alert('Formulaire soumis!');
                },
                onCancel: () => {
                    console.log('Modale annulée');
                }
            };
        }

        const modal = new Modal(options);
        modal.open();
    });
});

// Exemple d'utilisation programmatique
// Vous pouvez aussi créer des modales directement en JS comme ceci :
/*
document.getElementById('customBtn').addEventListener('click', () => {
    const modal = new Modal({
        title: 'Modale Dynamique',
        content: '<p>Créée directement depuis JavaScript!</p>',
        confirmText: 'OK',
        onConfirm: () => {
            console.log('Action confirmée');
        }
    });
    modal.open();
});
*/