# Projet WEB

Proposition de sujet : site de festival fictif

## Pour le faire fonctionner :

* Aller dans le dossier décompressé, ouvrir un terminal et taper ``` sudo npm install ```
* Puis initialiser un serveur mongoDB en tapant ``` sudo mongod ```
* Ouvrir un nouveau terminal, se placer dans le dossier du projet, puis lancer le serveur avec ``` npm start ```
* Et voilà ! Vous n'avez plus qu'à vous rendre [ici](http://localhost:5000/users/login)

## Présentation de l’idée :

Nous souhaiterions réaliser le site d’un festival musical fictif de genres variés. Ce serait donc un site promotionnel, sur lequel on pourrait acheter des billets, obtenir des informations sur les concerts et leur fréquentation, les artistes, le lieu et le logement, etc.

### Aspect technique :

Nous souhaitons implémenter certaines fonctionnalités qui nécessitent l’utilisation de bases de données :

* Billets nominatifs, permettant de récolter des données telles que le nom, l’adresse, l’âge, numéro de téléphone…

* Création de compte pour les utilisateurs, et pour les artistes, qui auront un statut spécial, et auront accès à une interface et des données supplémentaires (notamment sur la fréquentation estimée), et des informations complémentaires, contacts spécifiques etc

* Sondage après l’achat d’un billet pour indiquer à quel(s) concert(s) l’utilisateur compte participer. Ainsi, certaines données comme l’estimation du nombre de personnes participant seront publiques, permettant à chacun de prévoir son heure d'arrivée en fonction

* Recherche des artistes ou des concerts suivant des filtres comme le style, nom, fréquentation etc.

Le tout requerra la création et le traitement de bases de données, que nous réaliserons à l’aide des outils vus en cours tels que noSQL, mongodb etc, sachant que nous n’aurons pas besoin de traiter une quantité massive de données.

De même, pour le back-end, nous utiliserons NodeJS ou le module flask de python. Quant au front-end, nous utiliserons le langage HTML/CSS.

## Built With

* [Loginapp](https://github.com/bradtraversy/loginapp)
* [Un tuto](https://github.com/mjhea0/passport-local-express4) - pour une authentification avec passport, express, et mongodb
* [Tuto](https://github.com/mschwarzmueller/nodejs-shopping-cart-tutorial/tree/07-finishing-touches) - pour stripe/express/handlebars/mongoDB

## Authors

* [Florian G.](https://github.com/Flo502)
* [Jean-Baptiste L.](https://github.com/Jeeb183)
* [Iane V.](https://github.com/Jeeb183)

See also the list of [contributors](https://github.com/Projet-WEB/contributors) who participated in this project.
