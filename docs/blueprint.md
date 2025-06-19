# **App Name**: Polimik Gestion

## Core Features:

- Agenda des rendez-vous: Interface calendrier intuitive pour la planification des rendez-vous, affichage par jour/semaine/mois. Ajout de boutons client et édition.
- Vue de l'agenda des rendez-vous: Affichage des rendez-vous par tranches de 15 minutes, de 6h à 20h.
- Association client: Gestion des rendez-vous en les associant aux clients existants. Recherche par nom/adresse.
- Descriptions détaillées: Enregistrement des détails du rendez-vous, y compris le travail effectué. Ajout d'un lien Google Maps cliquable et d'un lien de numéro de téléphone.
- Suivi de l'état des rendez-vous: Suivi des statuts des rendez-vous.
- Demandes de devis en ligne: Formulaire en ligne permettant aux clients de soumettre des demandes de devis, comprenant le nom, l'adresse, le numéro de téléphone, la description des travaux et le téléchargement de fichiers.
- Liste des demandes de soumission: Liste des demandes de rendez-vous par ordre de soumission.
- Génération de factures: Génération de factures basées sur les rendez-vous.
- Regroupement des factures: Regroupement de plusieurs jours et services en une seule facture.
- Liste des services: Liste des services prédéfinis avec les tarifs associés.
- Ajout de matériel: Ajout de matériaux utilisés aux factures, avec le prix unitaire et la quantité.
- Personnalisation de la facture: Ajout de texte libre aux factures.
- Suivi de l'état de la facture: Suivi de l'état de la facture : Brouillon, Envoyé, Payé, Non payé.
- Intégration QuickBooks: Transfert des données de facturation vers QuickBooks, permettant une vérification manuelle avant l'importation.
- Génération de rapports de facturation: Génération de rapports de facturation par client, période, etc.
- Gestion des devis: Gérer les devis, les envoyer par e-mail, suivre leur statut (Envoyé, Accepté, Refusé).
- Conversion de devis en rendez-vous: Convertir les devis acceptés en rendez-vous.
- Intégration des paiements en ligne: Intégrer une passerelle de paiement sécurisée pour les paiements en ligne.
- Suivi des paiements: Suivre l'état, la date et le montant du paiement.
- Intégration de Google	Reviews: Envoyer automatiquement un e-mail au client après le rendez-vous avec un lien vers Google Reviews.
- SMS après-vente: Envoyer un SMS de remerciement avec un code QR/lien vers une enquête de satisfaction après le service.
- Suivi des dépenses: Photographier les reçus (à l'aide de l'appareil photo du téléphone/de l'ordinateur).
- Saisie manuelle des dépenses: Saisir manuellement les informations sur les dépenses (date, montant, catégorie, description).
- Transfert des données de dépenses: Transférer les données de dépenses vers QuickBooks, permettant une vérification manuelle.
- Base de données clients: Base de données clients avec des informations détaillées et l'historique des services.
- Authentification sécurisée: Authentification sécurisée pour les utilisateurs.
- Gestion des rôles: Gérer les rôles et les autorisations pour différents types d'utilisateurs.
- Langue: Application entièrement en français, tous écrans, notifications, e-mails, documents, commentaires de code.
- PWA réactif: Doit être installable en tant que PWA (icône, splash, écran d'accueil) et entièrement réactif pour ordinateur de bureau, tablette et mobile.
- Optimisation de la base de données: La base de données (Firestore/Data Connect) doit être structurée pour une performance maximale et des requêtes faciles (collections, index, relations optimisées).
- Accessibilité: L'interface utilisateur doit être accessible pour tous les âges d'utilisateurs (30-65 ans), être compatible avec les daltoniens, avec de grands boutons et un contraste clair.
- Personnalisable et modulaire: L'application doit être modulaire, permettant l'ajout facile de nouvelles fonctionnalités (ex : types de services, rapports, notifications).
- Notifications: Rappels automatisés des rendez-vous par e-mail et/ou SMS au personnel et aux clients.  Toutes les notifications et messages automatisés doivent être configurables et, au besoin, bilingues (français/anglais).
- Sécurité: Authentification forte (mot de passe ou Google), chiffrement des données en transit et au repos, conforme aux normes GDPR/Québec.

## Style Guidelines:

- Couleur primaire : Bleu foncé (#3F51B5) pour véhiculer le professionnalisme et la confiance, reflétant le secteur des services de nettoyage. (REMARQUE : La couleur et le logo correspondront finalement aux directives de la marque fournies.)
- Couleur de fond : Gris clair (#F0F2F5), une teinte neutre douce qui assure la lisibilité et le confort visuel.
- Couleur d'accentuation : Orange vif (#FF9800) pour mettre en évidence les actions clés et les informations importantes.
- Police du corps et du titre : « PT Sans », un sans-serif humaniste pour les titres et le corps du texte.
- Utiliser un jeu d'icônes cohérent et clair pour la navigation et les actions.
- Transitions subtiles pour le chargement et la mise à jour des données afin de donner une impression d'expérience utilisateur rapide.