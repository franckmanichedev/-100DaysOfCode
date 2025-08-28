let logoFile = null;
let logoPreview = null;

document.addEventListener('DOMContentLoaded', function() {
    const qrContent = document.getElementById('qr-content');
    const qrSize = document.getElementById('qr-size');
    const generateBtn = document.getElementById('generate-btn');
    const loading = document.getElementById('loading');
    const qrResult = document.getElementById('qr-result');
    const qrImage = document.getElementById('qr-image');
    const downloadBtn = document.getElementById('download-btn');
    const shareBtn = document.getElementById('share-btn');
    const colorOptions = document.querySelectorAll('.color-option');
    const logoUploadBtn = document.getElementById('logo-upload-btn');
    const logoInput = document.getElementById('qr-logo');
    const logoSizeValue = document.getElementById('logo-size');
    const logoFilename = document.getElementById('logo-filename');
    
    let currentColor = '000000';
    let lastGeneratedUrl = '';

  // Gestion des couleurs
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      colorOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      currentColor = this.dataset.color;
    });
  });

  // Gestion de l'upload du logo
  logoUploadBtn.addEventListener('click', function() {
    logoInput.click();
  });
  
  logoInput.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
      logoFile = e.target.files[0];
      logoFilename.textContent = logoFile.name;
      
      // Aperçu du logo
      const reader = new FileReader();
      reader.onload = function(e) {
        if (!logoPreview) {
          logoPreview = document.createElement('div');
          logoPreview.className = 'logo-preview';
          logoInput.parentNode.appendChild(logoPreview);
        }
        logoPreview.style.display = 'block';
        logoPreview.style.backgroundImage = `url(${e.target.result})`;
      };
      reader.readAsDataURL(logoFile);
    }
  });

  // Génération du QR Code
  generateBtn.addEventListener('click', generateQRCode);

  // Génération au clavier
  qrContent.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      generateQRCode();
    }
  });

  // Génération du QR Code
  
  function generateQRCode() {
    const content = qrContent.value.trim();
    if (!content) {
        alert('Veuillez entrer un texte ou une URL');
        return;
    }

    loading.style.display = 'block';
    qrResult.style.display = 'none';

    const size = qrSize.value.split('x')[0];
    const encodedContent = encodeURIComponent(content);
    
    if (logoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const logoSizeValue = document.getElementById('logo-size').value;
            const logoDataUrl = e.target.result;

            // Convertir SVG en PNG si nécessaire
            if (logoFile.type === 'image/svg+xml') {
                // Solution 1: Utiliser une image PNG par défaut
                alert('Les images SVG ne sont pas supportées. Veuillez utiliser une image PNG ou JPG.');
                loading.style.display = 'none';
                return;
                
                // Solution 2: Convertir SVG en PNG (plus complexe)
                convertSvgToPng(logoDataUrl).then(pngDataUrl => {
                    generateQRWithImage(pngDataUrl, logoSizeValue);
                });
            } else {
                // Pour PNG/JPG
                generateQRWithImage(logoDataUrl, logoSizeValue);
            }
        };
        reader.readAsDataURL(logoFile);
    } else {
        generateQRWithoutLogo();
    }
  }

  // Fonction séparée pour générer avec image
  function generateQRWithImage(imageDataUrl, sizeRatio) {
      const size = qrSize.value.split('x')[0];
      const encodedContent = encodeURIComponent(qrContent.value.trim());
      
      const qrUrl = `https://quickchart.io/qr?text=${encodedContent}&size=${size}&margin=1&dark=${currentColor}&centerImageUrl=${encodeURIComponent(imageDataUrl)}&centerImageSizeRatio=${sizeRatio}`;
      
      console.log('URL générée:', qrUrl);
      
      qrImage.onload = function() {
          loading.style.display = 'none';
          qrResult.style.display = 'block';
          lastGeneratedUrl = qrUrl;
      };
      
      qrImage.onerror = function() {
          loading.style.display = 'none';
          alert('Erreur: Essayez avec une image PNG/JPG plus petite.');
      };
      
      qrImage.src = qrUrl;
  }

  // Fonction séparée pour générer sans logo
  function generateQRWithoutLogo() {
      const size = qrSize.value.split('x')[0];
      const encodedContent = encodeURIComponent(qrContent.value.trim());
      
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedContent}&color=${currentColor}`;
      
      qrImage.onload = function() {
          loading.style.display = 'none';
          qrResult.style.display = 'block';
          lastGeneratedUrl = qrUrl;
      };
      
      qrImage.onerror = function() {
          loading.style.display = 'none';
          alert('Erreur lors de la génération du QR code.');
      };
      
      qrImage.src = qrUrl;
  }

  downloadBtn.addEventListener('click', function() {
    if (!lastGeneratedUrl) return;
    
    // &download=1 pour forcer le téléchargement
    const downloadUrl = lastGeneratedUrl.includes('quickchart.io') ? lastGeneratedUrl + '&download=1' : lastGeneratedUrl;
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'mon-qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Partage du QR Code
  shareBtn.addEventListener('click', function() {
    if (!lastGeneratedUrl) return;
    
    if (navigator.share) {
      navigator.share({
        title: 'Mon QR Code Généré',
        text: 'Regardez ce QR Code que j\'ai créé',
        url: lastGeneratedUrl
      }).catch(err => {
        console.error('Erreur de partage:', err);
        fallbackShare();
      });
    } else {
      fallbackShare();
    }
  });

  function fallbackShare() {
    alert('Copiez ce lien pour partager votre QR Code: ' + lastGeneratedUrl);
  }
});