# Pepiniere2
Propjet Final

Ajouter l’aspect international au projet2 : Internationalization  (i18n)
-	Adapter le comportement au pays de l’utilisateur : monnaie et méthode de calcul.
-	Supporter 2 langues : Fr et En.
 
Features à ajouter :
1-	Adapter le site web au pays de l’utilisateur :
a.	Ajouter 2 combobox :
i.	Pays
ii.	Monnaie

b.	Au début, 
i.	Remplir les 2 comboboxes an appelant des APIs
ii.	Trouver l’IP address publique de l’utilisateur (utiliser un API)
iii.	Trouver son pays et sa monnaie (utiliser un API)
iv.	Sélectionner comme valeurs par défaut des comboboxes Pays et Monnaie

c.	Quand un pays est sélectionné (par click ou automatique) :
i.	Chercher La monnaie
ii.	Sélectionner la monnaie trouvée comme valeur par défaut du combobox de Monnaie

d.	Quand une monnaie est sélectionnée (par click ou automatique).
i.	Changer tous les prix affiches dans la page en cours en convertissant a la monnaie sélectionnée en respectant le taux de change du jour.

e.	Quand une nouvelle page est affichée :
i.	Afficher tous les prix dans la monnaie sélectionnée dans le combobox des monnaies

2-	Gestions de la langue du site web

a.	A l’ouverture du site, l’affichage se fait dans la langue par defaut (voir point 4)
b.	Ajouter 2 radio-buttons qui permettent de sélectionner l’une des 2 langues (Fr ou En)
c.	Quand une langue est sélectionnée:
i.	Changer tous les textes de la page a la langue sélectionnée
d.	Quand une nouvelle page est affichée :
i.	Afficher dans la langue sélectionnée.
e.	Les labels du site dans les 2 langues doivent être personnalisés et sauvegardes dans un ou plusieurs fichiers (fichiers i18n) sur le disque local (NE PAS FAIRE DE TRADUCTION AUTOMTIQUE)


3-	Gestion du contenu i18n
a.	Créer une nouvelle section accessible juste par l’administrateur, protégée par unername/password, qui permet de voir et modifier les fichiers du contenu i18n
b.	A l’ouverture, les i18n doivent être lus du fichier et affiches dans une textearea
c.	L’utilisateur peut lire et modifier les labels
d.	Mettre un bouton « Sauvegarder » qui permet de sauvegarder le contenu dans les fichiers i18n sur le disque.
4-	Fichiers ressources : en plus des fichiers images (déjà présents dans le projet2), ajouter les fichiers suivants :
a.	Fichier de propriétés : contenant, entre autres, les credentials (username/password) du admin et la langue par défaut.
b.	Le contenu i18n
Choisissez le format que vous voulez pour ces fichiers.

Exemple d’APIs qu’on peut utiliser :
-	Liste des pays
o	https://freetestapi.com/api/v1/countries
-	liste des monnaies
o	https://freetestapi.com/api/v1/currencies
-	Ip address : 
o	https://api.ipify.org?format=json
-	Trouver le pays d’un IP Address
o	http://ip-api.com/json/

