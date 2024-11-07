# PDN (Prise de notes)
# Auteurs :
     - Nasandratra n°10 ( nasandratriniavo.andrianimanjaka@esti.mg )
     - Anicet n°34 ( anicet.randrianambinina@esti.mg)

## Description
Ce projet est une application web construite avec React et TypeScript. Elle utilise Firebase pour l'authentification et Firestore pour la gestion de la base de données. L'application permet aux utilisateurs de gérer des notes et des catégories.

## Fonctionnalités
- Authentification des utilisateurs avec Firebase
- Opérations CRUD pour les notes et les catégories
- Mode sombre
- Design réactif

## Technologies utilisées
- React
- TypeScript
- Firebase (Authentification et Firestore)
- Radix UI
- Lucide React

## Installation
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/AnicetJonhia/pdn.git

2.Accédez au répertoire du projet :
        
    cd pdn

3.Installez les dépendances :
        
    npm install


## Configuration
1.Créez un fichier .env à la racine du répertoire et ajoutez votre configuration Firebase :

    REACT_APP_FIREBASE_API_KEY=VOTRE_API_KEY
    REACT_APP_FIREBASE_AUTH_DOMAIN=VOTRE_AUTH_DOMAIN
    REACT_APP_FIREBASE_PROJECT_ID=VOTRE_PROJECT_ID
    REACT_APP_FIREBASE_STORAGE_BUCKET=VOTRE_STORAGE_BUCKET
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=VOTRE_MESSAGING_SENDER_ID
    REACT_APP_FIREBASE_APP_ID=VOTRE_APP_ID
    REACT_APP_FIREBASE_MEASUREMENT_ID=VOTRE_MEASUREMENT_ID


## Démarrage
### Exécutez l'application en mode développement :
    npm run dev

    
##Règles de sécurité Firestore
Assurez-vous que vos règles de sécurité Firestore permettent aux utilisateurs authentifiés de lire et écrire des données :
     
    rules_version = '2';
     service cloud.firestore {
        match /databases/{database}/documents {
          match /{document=**} {
             allow read, write: if request.auth != null;
          }
        }
     }

     
     
     
   
