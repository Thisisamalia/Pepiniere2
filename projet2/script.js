document.addEventListener('DOMContentLoaded', () => {
    const itemsPerPage = 4; // Nombre de produits affichés par page
    let currentPage = 0; // Page courante pour la pagination
    let produits = []; // Tableau pour stocker tous les produits récupérés
    let filteredProducts = []; // Tableau pour stocker les produits après filtrage
    let currentSection = 'home'; // Section actuellement affichée
    let cart = []; // Tableau pour stocker les produits ajoutés au panier

    // Fonction pour rendre les produits sur la page courante
    function renderProducts(page) {
        console.log(`Rendering products for page ${page}`);

        // Calculer l'index de début et de fin pour la page courante
        const start = page * itemsPerPage; // Début de la page courante
        const end = start + itemsPerPage; // Fin de la page courante
        // Sélectionner les produits visibles pour la page courante
        const visibleProducts = filteredProducts.slice(start, end);

        // Sélectionner la section des arbres dans la page
        const arbresSection = document.querySelector('#arbres-section .arbres');
        arbresSection.innerHTML = '';

        // Vérifier si des produits sont disponibles
        if (visibleProducts.length === 0) {
            arbresSection.innerHTML = '<p>No products available</p>';
        } else {
            // Créer et afficher les produits sur la page
            visibleProducts.forEach(produit => { // Pour chaque produit visible
                const produitDiv = document.createElement('div');
                produitDiv.className = 'produit';

                const img = document.createElement('img'); // Créer l'image du produit
                img.src = produit.image;
                img.alt = produit.nom;
                produitDiv.appendChild(img);

                const infoDiv = document.createElement('div'); // Créer la section des informations du produit
                infoDiv.className = 'info';

                const name = document.createElement('h2'); // Créer le nom du produit
                name.textContent = produit.nom;
                infoDiv.appendChild(name);

                const price = document.createElement('p'); // Créer le prix du produit
                price.textContent = `Prix: ${produit.prix}`; //utilisation du fichier produits.json
                infoDiv.appendChild(price);

                // Création du menu contextuel pour chaque produit
                const menuContextuel = document.createElement('div');
                menuContextuel.className = 'menu-contextuel';
                menuContextuel.style.display = 'none';

                const detailsLink = document.createElement('a');// Créer un lien pour les détails du produit
                detailsLink.textContent = 'Détails';
                detailsLink.href = "#";
                menuContextuel.appendChild(detailsLink);

                const addButton = document.createElement('button');// Créer un bouton pour ajouter au panier
                addButton.textContent = 'Ajouter';
                menuContextuel.appendChild(addButton);

                const type = document.createElement('p');// Créer le type de produit
                type.textContent = `Type: ${produit.type}`; //utilisation du fichier produits.json
                menuContextuel.appendChild(type);

                const descriptionLink = document.createElement('a'); // Créer un lien vers la description du produit
                descriptionLink.textContent = 'Description';
                descriptionLink.href = produit.description;
                descriptionLink.target = '_blank'; // Ouvrir le lien dans une nouvelle fenêtre
                menuContextuel.appendChild(descriptionLink);

                produitDiv.appendChild(infoDiv); // Ajouter les informations du produit au DOM
                produitDiv.appendChild(menuContextuel); // Ajouter le menu contextuel au DOM

                // Ajouter des écouteurs d'événements pour afficher les détails du produit
                produitDiv.addEventListener('click', (event) => {
                    //event.stopPropagation();
                    showProductDetails(produit);
                });

                produitDiv.addEventListener('mouseenter', () => { // Afficher le menu contextuel au survol
                    menuContextuel.style.display = 'block';
                });

                produitDiv.addEventListener('mouseleave', () => { // Cacher le menu contextuel au survol
                    menuContextuel.style.display = 'none';
                });

                addButton.addEventListener('click', (event) => {// Ajouter au panier au click
                    event.stopPropagation();
                    addToCart(produit);
                });

                arbresSection.appendChild(produitDiv); // Ajouter le produit au DOM
            });
        }

        // Activer ou désactiver les flèches de pagination en fonction de la page courante
        document.getElementById('prev-arrow').disabled = currentPage === 0;
        document.getElementById('next-arrow').disabled = end >= filteredProducts.length;
    }

    // Fonction pour ajouter un produit au panier
    function addToCart(produit, quantity = 1) { // Ajouter un produit au panier
        for (let i = 0; i < quantity; i++) { // itérer le nombre de fois indiqué par l'utilisateur
            cart.push(produit); // Ajouter le produit au panier dans le tableau
        }
        updateCart(); // Mettre à jour l'affichage du panier après ajout
    }

    // Fonction pour mettre à jour l'affichage du panier
    function updateCart() { // Mettre à jour l'affichage du panier
        const cartTable = document.querySelector('#panier-section .cart-items');
        const cartTotal = document.querySelector('#panier-section .cart-total');
        let totalPrice = 0;

        cartTable.innerHTML = '';

        const productQuantities = {}; // Tableau pour stocker les quantités de chaque produit

        // Calculer la quantité de chaque produit dans le panier
        cart.forEach(item => { // Pour chaque produit du panier
            if (!productQuantities[item.nom]) { // Si le produit n'est pas déjà dans le tableau
                productQuantities[item.nom] = { ...item, quantite: 0 };// Ajouter le produit au tableau
            }
            productQuantities[item.nom].quantite += 1;// Incrémenter la quantité du produit
        });

        // Afficher les produits et leurs quantités dans le panier
        Object.values(productQuantities).forEach(item => { // Pour chaque produit dans le tableau
            const row = document.createElement('tr'); // Créer une ligne pour le produit

            const nameCell = document.createElement('td'); // Créer une cellule pour le nom du produit
            nameCell.textContent = item.nom;
            row.appendChild(nameCell);

            const quantityCell = document.createElement('td');
            quantityCell.textContent = item.quantite;
            row.appendChild(quantityCell);

            const priceCell = document.createElement('td');
            priceCell.textContent = item.prix; //
            row.appendChild(priceCell);

            const totalCell = document.createElement('td');
            const unitPrice = parseFloat(item.prix.replace('Prix: ', '').replace(',', '.')); // Convertir la chaîne en nombre
            const totalProductPrice = unitPrice * item.quantite; // Calculer le prix total du produit
            totalCell.textContent = `Prix total: ${totalProductPrice.toFixed(2)} $`; // Afficher le prix total du produit avec 2 décimales
            row.appendChild(totalCell);

            const removeCell = document.createElement('td');
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Supprimer'; // Ajouter un bouton pour supprimer le produit du panier
            removeButton.className = 'remove-button'; 
            removeButton.addEventListener('click', () => { // Ajouter un écouteur d'événement pour le bouton de suppression
                removeFromCart(item.nom);
            });
            removeCell.appendChild(removeButton);
            row.appendChild(removeCell);

            cartTable.appendChild(row);

            totalPrice += totalProductPrice; // Incrémenter le prix total
        });

        // Calculer les taxes et le montant total
        const tps = totalPrice * 0.05;
        const tvq = totalPrice * 0.09975;
        const finalAmount = totalPrice + tps + tvq; // Calculer le montant total

        cartTotal.innerHTML = ` 
            <p>Total avant taxes: ${totalPrice.toFixed(2)} $</p>
            <p>TPS (5%): ${tps.toFixed(2)} $</p>
            <p>TVQ (9.975%): ${tvq.toFixed(2)} $</p>
            <p>Total à payer: ${finalAmount.toFixed(2)} $</p>
        `;
    }

    // Fonction pour retirer un produit du panier
    function removeFromCart(productName) { // Supprimer un produit du panier
        cart = cart.filter(item => item.nom !== productName); // Supprimer le produit du panier
        updateCart(); // Mettre à jour l'affichage du panier après suppression
    }

    // Événement pour le bouton d'achat
    const acheterButton = document.getElementById('acheter-button');
    acheterButton.addEventListener('click', () => {
        if (cart.length > 0) { // Si le panier est  vide
            // Réinitialiser le panier
            cart = [];
            updateCart();

            // Afficher un message de confirmation
            const messageContainer = document.getElementById('message-container'); /// Afficher un message de confirmation
            if (messageContainer) { // Si le message de confirmation existe
                messageContainer.style.display = 'block'; // Afficher le message de confirmation
            }
        } else {
            alert('Votre panier est vide!');
        }
       
    });

    // Fonction pour afficher les détails d'un produit
    function showProductDetails(produit) {
        const detailsSection = document.getElementById('details-section');
        const detailsContent = document.getElementById('details-content');
    
        if (!detailsSection || !detailsContent) { // Si la section ou le contenu des détails n'existe pas
            console.error('Details section or content not found');
            return; 
        }
    
        detailsContent.innerHTML = `
            <h2>${produit.nom}</h2>
            <img src="${produit.image}" alt="${produit.nom}" style="max-width: 100%; height: auto;">
            <p>Type: ${produit.type}</p>
            <p>Prix: ${produit.prix}</p>
            <p>${produit.informations}</p>
            <label for="quantite">Quantité:</label>
            <input type="number" id="quantite" name="quantite" value="1" min="1" placeholder="Quantité" class="quantite">
            <p id="stock-info">Stock disponible : ${produit.stock || 'Non spécifié'}</p>
            <button id="add-to-cart-button">Ajouter au panier</button>
        `;
    
        const quantiteProduit = document.getElementById('quantite');
        const btnPurchase = document.getElementById('add-to-cart-button');
        
        // Fonction pour vérifier la quantité disponible
        function checkQuantity() { // Vérifier la quantité disponible
            const quantite = parseInt(quantiteProduit.value, 10) || 1; // Convertir la chaîne en nombre si l'utilisateur n'a pas entré de quantité elle-même elle sera de 1
            const stock = parseInt(produit.stock, 10) || 0; // Convertir la chaîne en nombre si l'utilisateur n'a pas entré de stock elle sera de 0
    
            if (quantite > stock) { // Si la quantité est supérieure au stock disponible
                btnPurchase.classList.add('add-to-cart-button-disabled'); // Ajouter le style disabled au bouton
                btnPurchase.disabled = true;
            } else {
                btnPurchase.classList.remove('add-to-cart-button-disabled'); // Supprimer le style disabled au bouton
                btnPurchase.disabled = false;
            }
        }
    
        // Vérifier la quantité initiale et mettre à jour l'état du bouton
        checkQuantity();
    
        quantiteProduit.addEventListener('input', checkQuantity); // Ajouter un écouteur d'événement pour le champ de quantité
    
        btnPurchase.addEventListener('click', () => { // Ajouter un écouteur d'événement pour le bouton d'achat
            const quantity = parseInt(quantiteProduit.value, 10) || 1; // Convertir la chaîne en nombre si l'utilisateur n'a pas entré de quantité elle sera de 1
            if (quantity <= (parseInt(produit.stock, 10) || 0)) { // Si la quantité demandée est inférieure ou égale au stock disponible
                addToCart(produit, quantity); // Ajouter le produit au panier et la quantité demandée
            } else {
                alert('Quantité demandée dépasse le stock disponible'); // Afficher un message d'erreur si la quantité demandée dépasse le stock disponible
            }
        });
    
        document.getElementById(currentSection + '-section').style.display = 'none'; // Cacher la section actuelle
        detailsSection.style.display = 'block'; // Afficher la section des détails
    
        const header = document.querySelector('.header'); 
        if (header) {
            header.classList.add('header-disabled'); 
        }
    }
    
    // Fonction pour charger les produits depuis un fichier JSON
    function fetchProducts() {
        fetch('produits.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                produits = data.produits;
                filteredProducts = produits;
                renderProducts(currentPage);
                initializeCategoryButtons();
            })
            .catch(error => console.error('Error loading JSON data:', error));
    }

    // Fonction pour filtrer les produits par terme de recherche et catégorie
    function filterProducts(searchTerm, category) { // Filtrer les produits par terme de recherche et catégorie
        const normalizedSearchTerm = searchTerm.toUpperCase(); //
        filteredProducts = produits.filter(produit => {
            const matchesSearch = produit.nom.toUpperCase().includes(normalizedSearchTerm); // Si le produit contient le terme de recherche
            const matchesCategory = category === 'all' || produit.type.toUpperCase() === category.toUpperCase(); // Si la catégorie est 'all' ou si la catégorie du produit correspond à la catégorie sélectionnée
            return matchesSearch && matchesCategory; // Retourner true si le produit correspond à la recherche et à la catégorie
        });
        currentPage = 0; // Réinitialiser la page courante à la première page
        renderProducts(currentPage); // Afficher les produits filtrés pour la page courante
    }

    //Fonction pour filtrer les produits en fonction de la catégorie sélectionnée
    function filterByCategory(value) { 
        const buttons = document.querySelectorAll(".button-value");
        buttons.forEach(button => {
            button.classList.toggle("active", value.toUpperCase() === button.innerText.toUpperCase());
        });
        filterProducts(document.getElementById('search-input').value, value);
    }

     //Fonction pour gérer la recherche des produits
    function handleSearch() {
        const searchInput = document.getElementById('search-input').value;
        const selectedCategory = Array.from(document.querySelectorAll('.button-value.active')).map(button => button.innerText)[0] || 'all';
        filterProducts(searchInput, selectedCategory);
    }

    // Fonction pour initialiser les boutons de catégorie
    function initializeCategoryButtons() {
        const categoryButtons = document.querySelectorAll('.button-value');
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterByCategory(button.innerText);
            });
        });
    }

    // Fonction pour afficher une section spécifique
    function showSection(sectionId) {
        console.log(`Showing section: ${sectionId}`);// Afficher la section spécifiée

        const sections = document.querySelectorAll('.section');
        sections.forEach(section => section.style.display = 'none');

        const sectionToShow = document.getElementById(`${sectionId}-section`);
        if (sectionToShow) {
            sectionToShow.style.display = 'block';

            const header = document.querySelector('.header');
            if (sectionId === 'details') {
                header.classList.add('header-disabled');
            } else {
                header.classList.remove('header-disabled');
            }

            currentSection = sectionId;
        }
    }

    // Ajouter des écouteurs d'événements pour les liens de navigation
    document.querySelectorAll('.nav-link').forEach(link => { // Pour chaque lien de navigation
        link.addEventListener('click', (e) => { // Ajouter un écouteur d'événement pour le lien de navigation
            e.preventDefault(); 
            const sectionId = e.target.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    // Ajouter des écouteurs d'événements pour les flèches de pagination
    document.getElementById('prev-arrow').addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            renderProducts(currentPage);
        }
    });

    document.getElementById('next-arrow').addEventListener('click', () => {
        if ((currentPage + 1) * itemsPerPage < filteredProducts.length) {
            currentPage++;
            renderProducts(currentPage);
        }
    });

    // Ajouter un écouteur d'événement pour le bouton de recherche
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    } else {
        console.error('Search button not found');
    }

    // Ajouter un écouteur d'événement pour le champ de recherche
    document.getElementById('search-input').addEventListener('input', handleSearch);

    // Ajouter un écouteur d'événement pour le bouton de fermeture des détails
    document.getElementById('close-details-button').addEventListener('click', () => {
        document.getElementById('details-section').style.display = 'none';
        showSection(currentSection);
    });

    // Afficher la section d'accueil au chargement de la page et récupérer les produits
    showSection('home'); // Afficher la section d'accueil
    fetchProducts();// Charger les produits depuis le fichier JSON
});
