// Affichage de la bio longue
const showBioBtn = document.getElementById('show-bio-btn');
const bioLongue = document.getElementById('bio-longue');
if (showBioBtn && bioLongue) {
    showBioBtn.addEventListener('click', function() {
        if (bioLongue.style.display === 'none') {
            bioLongue.style.display = 'block';
            showBioBtn.textContent = 'Masquer la bio longue';
        } else {
            bioLongue.style.display = 'none';
            showBioBtn.textContent = 'Voir la bio longue';
        }
    });
}
