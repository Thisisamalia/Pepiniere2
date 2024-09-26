
    let adminInfos;

    // Charger les informations du fichier admin.json
    fetch('admin.json')
        .then(response => response.json())
        .then(data => {
            adminInfos = data;  // Stocker les informations de l'administrateur
        })
        .catch(error => console.error('Erreur lors du chargement des credentials admin:', error));

    const loginForm = document.getElementById('admin-login-form');
    const loginSection = document.getElementById('login-form');
    const i18nSection = document.getElementById('i18n-editor-section');
    const errorMessage = document.getElementById('login-error-message');
    
    // Affiche le formulaire de connexion quand on clique sur le lien Admin (h ref admin)
    document.getElementById('admin-login-link').addEventListener('click', (e) => {
        e.preventDefault();
        loginSection.style.display = 'block';
    });

    // PRENDRE LES VALEURS INSCRITE AU FORM
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Vérifier les infos de l'admin via les infos dans le fichier admin.json
        if (username === adminInfos.adminUsername && password === adminInfos.adminPassword) {
            loginSection.style.display = 'none';
            i18nSection.style.display = 'block';
            loadTranslations();
        } else {
            errorMessage.style.display = 'block';  // Affichage du message d'erreur dans pepiniere
        }
    

    // Chargement le fichier translations.json dans la textarea
    function loadTranslations() {
        fetch('translations.json')
            .then(response => response.json())
            .then(data => {
                document.getElementById('i18n-editor').value = JSON.stringify(data, null, 2);
            })
            .catch(error => console.error('Erreur lors du chargement des traductions:', error));
    }

    // Fonction pour télécharger le fichier. code donné par prof
    function saveInFile(jsonText, fileName) {
        const a = document.createElement('a');
        const blob = new Blob([jsonText], {type: 'application/json'});
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        a.click();
    }

    // Sauvegarder et télécharger le fichier modifié
    document.getElementById('save-button').addEventListener('click', () => {
        const updatedContent = document.getElementById('i18n-editor').value;

        // Vérifier validité du fichier JSON
        try {
            JSON.parse(updatedContent);  // Si le JSON est valide, il ne lancera pas d'erreur
            saveInFile(updatedContent, 'translations.json');
            window.alert('Votre fichier a bien été téléchargé.');
        } catch (e) {
            window.alert('Erreur: Votre fichier n\'est pas valide.');
        }
    });
});
