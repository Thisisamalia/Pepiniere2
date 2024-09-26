document.addEventListener('DOMContentLoaded', () => {
    const itemsPerPage = 4; // Nombre de produits affichés par page
    let currentPage = 0; // Page courante pour la pagination
    let produits = []; // Tableau pour stocker tous les produits récupérés
    let filteredProducts = []; // Tableau pour stocker les produits après filtrage
    let currentSection = 'home'; // Section actuellement affichée
    let cart = []; // Tableau pour stocker les produits ajoutés au panier
    let exchangeRates = {}; // Tableau pour stocker le taux de change
    let language = 'fr'; // Langue actuelle
   
    // Fonction pour rendre les produits sur la page courante
    function renderProducts(page) {
        console.log(`Rendering products for page ${page}`);
    
        const start = page * itemsPerPage; // Début de la page courante
        const end = start + itemsPerPage; // Fin de la page courante
        const visibleProducts = filteredProducts.slice(start, end);
    
        const arbresSection = document.querySelector('#arbres-section .arbres');
        arbresSection.innerHTML = '';
    
        if (visibleProducts.length === 0) {
            arbresSection.innerHTML = '<p id="arbresSection">No products available</p>';
        } else {
            visibleProducts.forEach((produit, index) => { // Ajouter index ici
                const produitDiv = document.createElement('div');
                produitDiv.className = 'produit';
    
                const img = document.createElement('img');
                img.src = produit.image;
                img.alt = produit.nom;
                produitDiv.appendChild(img);
    
                const infoDiv = document.createElement('div');
                infoDiv.className = 'info';
    
                const name = document.createElement('h2');
                name.textContent = produit.nom;
                infoDiv.appendChild(name);
    
                const price = document.createElement('p'); // Créer le prix du produit
                price.textContent = `Prix: ${produit.prix}`; // Utilisation du fichier produits.json
                price.id = `price-${index}`; // Utilisation de backticks
                infoDiv.appendChild(price);
    
                // Création du menu contextuel pour chaque produit
                const menuContextuel = document.createElement('div');
                menuContextuel.className = 'menu-contextuel';
                menuContextuel.style.display = 'none';
    
                const detailsLink = document.createElement('a');
                detailsLink.textContent = 'Détails';
                detailsLink.id = `detailsLink-${index}`; // Utilisation de backticks
                detailsLink.href = "#";
                menuContextuel.appendChild(detailsLink);
    
                const addButton = document.createElement('button');
                addButton.textContent = 'Ajouter';
                addButton.id = `addButton-${index}`; // Utilisation de backticks
                menuContextuel.appendChild(addButton);
    
                const type = document.createElement('p');
                type.textContent = `Type: ${produit.type}`;
                menuContextuel.appendChild(type);
    
                const descriptionLink = document.createElement('a');
                descriptionLink.textContent = 'Description';
                descriptionLink.href = produit.description;
                descriptionLink.id = `descriptionLink-${index}`; // Utilisation de backticks
                descriptionLink.target = '_blank';
                menuContextuel.appendChild(descriptionLink);
    
                produitDiv.appendChild(infoDiv);
                produitDiv.appendChild(menuContextuel);
    
                produitDiv.addEventListener('click', (event) => {
                    showProductDetails(produit);
                });
    
                produitDiv.addEventListener('mouseenter', () => {
                    menuContextuel.style.display = 'block';
                });
    
                produitDiv.addEventListener('mouseleave', () => {
                    menuContextuel.style.display = 'none';
                });
    
                addButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    addToCart(produit);
                });
    
                arbresSection.appendChild(produitDiv);
            });
        }
    
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
            removeButton.id = 'removeButton';
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
            <p id=cartTotal>Total avant taxes: ${totalPrice.toFixed(2)} $</p>
            <p id=tps>TPS (5%): ${tps.toFixed(2)} $</p>
            <p>TVQ id=tvq (9.975%): ${tvq.toFixed(2)} $</p>
            <p id=finalAmount>Total à payer: ${finalAmount.toFixed(2)} $</p>
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

// Changement de langue
document.querySelectorAll('.lang-radio').forEach(radio => { 
    radio.addEventListener('change', function() {
        const lang = this.value; // 'fr' ou 'en'
        fetch('translations.json')
            .then(response => response.json())
            .then(data => {
                const translations = data[lang];

                // Mise à jour des traductions
                for (let key in translations) {
                    const elements = document.querySelectorAll(`[id^="${key}"]`);
                    elements.forEach(element => {
                        element.textContent = translations[key];
                    });
                }

                // Mettre à jour les prix
                const priceElements = document.querySelectorAll('[id^="price-"]');
                priceElements.forEach(priceElement => {
                    const produitIndex = priceElement.id.split('-')[1]; // Obtenir l'index du produit
                    const produit = filteredProducts[parseInt(produitIndex, 10)]; // Récupérer le produit

                    if (produit) {
                        priceElement.textContent = `${translations.priceLabel} ${produit.prix}`; // Format correct
                    } else {
                        console.log(`Aucun produit trouvé à l'index: ${produitIndex}`);
                    }
                });
            })
            .catch(error => console.error('Error loading JSON data:', error));
    });
});



    // Fonction pour récupérer l'adresse IP de l'utilisateur
    function getUserIp() {
        const url = 'https://api.ipify.org?format=json';
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const ip = data.ip;
                console.log(`IP address: ${ip}`);

                // Appel à l'API pour obtenir le pays et la monnaie en fonction de l'IP
                return fetch(`https://ipapi.co/${ip}/json/`);
            })
            .then(response => response.json())
            .then(data => {
                const userCountry = data.country_name; // Nom du pays
                const userCurrency = data.currency; // Code de la monnaie
                console.log(`User Country: ${userCountry}`);
                console.log(`User Currency: ${userCurrency}`);

                // Peupler les comboboxes avec ces informations
                populateComboboxes(userCountry, userCurrency);
            })
            .catch(error => console.error('Error fetching IP address or country info:', error));
    }

    // Fonction pour peupler les combobox de pays et de monnaies
    function populateComboboxes(userCountry, userCurrency) {
        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                const countrySelect = document.getElementById('country-select');
                const currencySelect = document.getElementById('currency-select');

                // Objet pour mapper pays à devise
                const countryCurrencyMap = {};

                // Peupler le combobox de pays
                countrySelect.innerHTML = '';
                data.sort((a, b) => a.name.common.localeCompare(b.name.common)); // mettre en ordre alphabétique

                data.forEach(country => { // Pour chaque pays
                    const option = document.createElement('option');// Créer un élément d'option pour le pays
                    option.value = country.cca2; // Code alpha-2
                    option.text = country.name.common; // Nom du pays

                    // Mapper le pays à sa devise
                    if (country.currencies) { // Si le pays a des devises
                        for (const currencyCode in country.currencies) { // Pour chaque devise du pays
                            countryCurrencyMap[country.name.common] = currencyCode; // Ajouter au mapping
                        }
                    }

                    // Sélection par défaut pour le pays basé sur l'IP
                    if (country.name.common === userCountry) { // Si le pays correspond à l'IP
                        option.selected = true; // Sélectionner l'option
                    }

                    countrySelect.appendChild(option); // Ajouter l'option au combobox
                });

                // Peupler le combobox de monnaies
                currencySelect.innerHTML = ''; // Vider le combobox de devises
                const existingCurrencies = new Set(); // Pour éviter les doublons
                const currencyNames = {}; // Pour stocker les noms des devises

                data.forEach(country => { // Pour chaque pays
                    if (country.currencies) { // Si le pays a des devises
                        for (const currencyCode in country.currencies) { // Pour chaque devise du pays
                            existingCurrencies.add(currencyCode); // Ajouter au set
                            currencyNames[currencyCode] = country.currencies[currencyCode].name; // Ajouter au mapping
                        }
                    }
                });

                // Ajouter les devises au combobox
                existingCurrencies.forEach(currencyCode => {
                    const option = document.createElement('option');
                    option.value = currencyCode; // Code de la devise
                    option.text = `${currencyCode} - ${currencyNames[currencyCode]}`;

                    // Sélection par défaut pour la monnaie basée sur l'IP
                    if (currencyCode === userCurrency) {
                        option.selected = true;
                    }

                    currencySelect.appendChild(option);
                });

                // Lier le changement de pays à la mise à jour de la monnaie
                changeCurrency(countrySelect, currencySelect, countryCurrencyMap);

                // Écouter le changement de devise
                currencySelect.addEventListener('change', (event) => {
                    const selectedCurrency = event.target.value; // Récupérer la devise sélectionnée
                    fetchExchangeRates(selectedCurrency); // Appeler la fonction pour récupérer les taux de change
                });
            })
            .catch(error => console.error('Error loading JSON data:', error));
    }
  
    function changeCurrency(countrySelect, currencySelect, countryCurrencyMap) {
        countrySelect.addEventListener('change', () => { // Écouter le changement de pays
            const selectedCountry = countrySelect.options[countrySelect.selectedIndex].text; // Obtenir le nom du pays sélectionné
            const currencyCode = countryCurrencyMap[selectedCountry]; // Obtenir la devise associée au pays
    
            if (currencyCode) {
                currencySelect.value = currencyCode; // Mettre à jour la devise sélectionnée
                fetchExchangeRates(currencyCode); // Récupérer les taux de change pour la nouvelle devise
            }
        });
    }

    // Fonction pour récupérer les taux de change
    function fetchExchangeRates(selectedCurrency) {
        fetch('https://api.exchangerate-api.com/v4/latest/USD')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                exchangeRates = data.rates;
                console.log('Exchange rates fetched:', exchangeRates);
                updatePrices(selectedCurrency);
            })
            .catch(error => console.error('Error fetching exchange rates:', error));
            
    }
    
    
   // Fonction pour mettre à jour les prix des produits en fonction du taux de change sélectionné et le pays sélectionné
    function updatePrices(selectedCurrency) { // Mettre à jour les prix des produits
        fetch('produits.json')
            .then(response => response.json())
            .then(data => {
                const convertedProducts = data.produits.map(product => { // Convertir les prix en devise
                    // Retirer le symbole '$' et convertir le prix en nombre
                    const originalPrice = parseFloat(product.prix.replace('$', '')); // Convertir la chaîne en nombre
                    const rate = exchangeRates[selectedCurrency]; // Obtenir le taux de change pour la devise sélectionnée
                    const convertedPrice = (originalPrice * (rate || 1)).toFixed(2); // Calculer le prix converti
                    
                    // Vérifie si le taux de change existe
                    if (rate) {
                        return { ...product, prix: `${convertedPrice} ${selectedCurrency}` }; // Ajoute la devise ici
                    } else {
                        return { ...product, prix: `${originalPrice} $` }; // Garde le prix original si le taux n'est pas trouvé
                    }
                });
                filteredProducts = convertedProducts; // Met à jour les produits filtrés avec les prix convertis
                renderProducts(currentPage); // Rendre les produits avec les nouveaux prix
            })
            .catch(error => console.error('Error fetching products:', error));
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
    document.querySelectorAll('.nav-link').forEach(link => { 
        // Pour chaque lien de navigation
        link.addEventListener('click', (e) => { 
            e.preventDefault();
    
            const sectionId = e.target.getAttribute('data-section');
            showSection(sectionId); // Appel à la fonction showSection existante
    
            // Scroll vers le haut de la page
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
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

    getUserIp();
    fetchExchangeRates();

    // Afficher la section d'accueil au chargement de la page et récupérer les produits
    showSection('home'); // Afficher la section d'accueil
    fetchProducts();// Charger les produits depuis le fichier JSON

// menu burger adaptatif
const burgerMenu = document.getElementById('burger-menu');
const navMenu = document.querySelector('.nav-menu'); 
const closeMenu = document.getElementById('close-menu');
const headerTopRight = document.querySelector('.header-top-right');

burgerMenu.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    headerTopRight.classList.toggle('show'); // Include header-top-right in the menu
});

// Close menu on close button click
closeMenu.addEventListener('click', () => {
    navMenu.classList.remove('show');
    headerTopRight.classList.remove('show'); // Hide header-top-right when closing
});

// Close menu when clicking outside
document.addEventListener('click', (event) => {
    const isClickInside = navMenu.contains(event.target) || burgerMenu.contains(event.target);
    if (!isClickInside) {
        navMenu.classList.remove('show');
        headerTopRight.classList.remove('show'); // Hide header-top-right when clicking outside
    }
});

})