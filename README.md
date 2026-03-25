# 🎓 QSM Generator — Plateforme de génération de Quiz

> Une application complète de création, gestion et passage de quiz en ligne, avec génération PDF, invitations par email, QR codes et génération automatique par IA.

---

## Table des matières

- [Description du projet](#-description-du-projet)
- [Use Cases principaux](#-use-cases-principaux)
- [Stack technique](#-stack-technique)
- [Architecture Docker](#-architecture-docker)
- [Installation et démarrage](#-installation-et-démarrage)
- [Commandes Docker essentielles](#-commandes-docker-essentielles)
- [Variables d'environnement](#-variables-denvironnement)
- [Accès aux services](#-accès-aux-services)
- [Workflow de développement](#-workflow-de-développement)

---

##  Description du projet

**QSM Generator** est une plateforme web permettant aux professeurs et formateurs de créer des quiz (QCM) et de les distribuer à leurs candidats via différents canaux : lien web, QR code, email ou PDF imprimable.

Chaque quiz peut être publié avec des **versions mélangées** (shuffle des questions **et** des choix de réponse) pour éviter la triche entre candidats. Les résultats sont automatiquement calculés, enregistrés et consultables par le formateur depuis son tableau de bord.

---

##  Use Cases principaux

###  Pour le professeur (Dashboard)
| Action | Description |
|--------|-------------|
|  **Créer un quiz** | Formulaire complet avec questions, choix, timer et taux de réussite |
|  **Créer avec l'IA** | Décrire un quiz en langage naturel, l'IA le génère automatiquement via Groq |
|  **Modifier un quiz** | Édition complète des questions et choix existants |
|  **Publier en Web** | Envoi d'invitations personnalisées par email avec QR code unique par candidat |
|  **Publier en PDF** | Génération d'un ZIP contenant des versions PDF avec questions **et choix mélangés** à imprimer |
|  **Anti-triche (shuffle)** | Chaque version mélange l'ordre des questions **et** l'ordre des choix de réponse |
|  **Partager un lien direct** | Lien public + QR code téléchargeable sans compte requis |
|  **Consulter les résultats** | Tableau de bord des résultats : voir tous les candidats ayant passé un quiz, leur score, leur taux de réussite et si ils ont réussi ou échoué |
|  **Statistiques globales** | Score moyen, temps moyen, taux de réussite global par quiz |

###  Pour le candidat
| Action | Description |
|--------|-------------|
|  **Accès par email** | Lien unique reçu par mail, usage unique (expire après soumission) |
|  **Accès par QR code** | Scanner le code QR pour accéder directement au quiz |
|  **Accès par lien direct** | URL partageable sans authentification |
|  **Passer le quiz** | Interface responsive avec timer, navigation entre questions |
|  **Voir son score** | Résultats immédiats après soumission |

---

##  Stack technique

| Couche | Technologie |
|--------|-------------|
| **Frontend** | React 18 + Vite + Tailwind CSS |
| **Backend** | Symfony 7 + API Platform |
| **Base de données** | MySQL 8.0 |
| **Authentification** | JWT (LexikJWTAuthenticationBundle) |
| **Email** | MailHog (dev) + Symfony Mailer |
| **PDF** | DOMPDF |
| **QR Code** | endroid/qr-code |
| **IA** | Groq API (llama-3.3-70b-versatile) |
| **Reverse proxy** | Nginx |
| **Conteneurisation** | Docker + Docker Compose |

---

##  Architecture Docker

```
projet_QCM_generator/
├── backend/          → Symfony API (PHP 8.3-FPM)
├── frontend/         → React + Vite
├── nginx/            → Reverse proxy
└── docker-compose.yml
```

| Container | Image | Port |
|-----------|-------|------|
| `qsm_backend` | `projet_qcm_generator-backend` | 9000 (interne) |
| `qsm_frontend` | `projet_qcm_generator-frontend` | 5173 |
| `qsm_nginx` | `nginx:alpine` | **8090** |
| `qsm_db` | `mysql:8.0` | 3308 |
| `qsm_phpmyadmin` | `phpmyadmin/phpmyadmin` | **8091** |
| `qsm_mailhog` | `mailhog/mailhog` | **8092** (UI), 1025 (SMTP) |

---

##  Installation et démarrage

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et démarré
- [Git](https://git-scm.com/) installé

### 1. Cloner le projet

```bash
git clone https://github.com/ayabelmahi/projet_QCM_generator.git
cd projet_QCM_generator
```

### 2. Configurer les variables d'environnement

Créer le fichier `backend/.env` :

```env
DATABASE_URL="mysql://root:root@db:3306/qsm?serverVersion=8.0"
DEFAULT_URI=http://localhost:8090
MAILER_DSN=smtp://mailhog:1025
GROQ_API_KEY=votre_cle_groq_ici
CORS_ALLOW_ORIGIN='*'
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=votre_passphrase_ici
```

Créer le fichier `frontend/.env` :

```env
VITE_APP_URL=http://localhost:5173
```

### 3. Démarrer tous les containers

```bash
docker-compose up -d
```

### 4. Générer les clés JWT

```bash
docker exec -it qsm_backend php bin/console lexik:jwt:generate-keypair
```

### 5. Exécuter les migrations

```bash
docker exec -it qsm_backend php bin/console doctrine:migrations:migrate
```

### 6. Accéder à l'application

Ouvrir [http://localhost:5173](http://localhost:5173) dans le navigateur.

---

##  Commandes Docker essentielles

### Démarrage / Arrêt

```bash
# Démarrer tous les containers
docker-compose up -d

# Arrêter tous les containers
docker-compose down

# Redémarrer un container spécifique
docker restart qsm_backend
docker restart qsm_frontend
```

### Build

```bash
# Rebuilder tous les containers
docker-compose up -d --build

# Rebuilder uniquement le backend
docker-compose up -d --build backend

# Rebuilder uniquement le frontend
docker-compose up -d --build frontend
```

### Logs

```bash
# Voir les logs d'un container
docker logs qsm_backend --tail 50
docker logs qsm_frontend --tail 50

# Suivre les logs en temps réel
docker logs -f qsm_backend
```

### Accès aux containers

```bash
# Accéder au shell du backend
docker exec -it qsm_backend bash

# Accéder au shell du frontend
docker exec -it qsm_frontend sh
```

### Symfony / Backend

```bash
# Vider le cache Symfony
docker exec -it qsm_backend php bin/console cache:clear

# Générer une migration
docker exec -it qsm_backend php bin/console doctrine:migrations:diff

# Exécuter les migrations
docker exec -it qsm_backend php bin/console doctrine:migrations:migrate

# Valider le schéma
docker exec -it qsm_backend php bin/console doctrine:schema:validate

# Lister les routes
docker exec -it qsm_backend php bin/console debug:router

# Installer les dépendances Composer
docker exec -it qsm_backend composer install
```

### Frontend

```bash
# Installer les dépendances npm
docker exec -it qsm_frontend npm install

# Installer un package spécifique
docker exec -it qsm_frontend npm install nom-du-package
```

### Base de données

```bash
# Synchroniser le schéma sans migration
docker exec -it qsm_backend php bin/console doctrine:schema:update --force
```

---

##  Variables d'environnement

### Backend (`backend/.env`)

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion MySQL | `mysql://root:root@db:3306/qsm?serverVersion=8.0` |
| `MAILER_DSN` | Configuration email | `smtp://mailhog:1025` |
| `GROQ_API_KEY` | Clé API Groq pour l'IA | `gsk_...` |
| `CORS_ALLOW_ORIGIN` | Origines CORS autorisées | `'*'` |
| `JWT_PASSPHRASE` | Passphrase des clés JWT | `votre_passphrase` |

### Frontend (`frontend/.env`)

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_APP_URL` | URL de base du frontend | `http://localhost:5173` |



---

##  Accès aux services

| Service | URL | Identifiants |
|---------|-----|--------------|
| **Application** | http://localhost:5173 | Créer un compte |
| **API Backend** | http://localhost:8090/api | — |
| **phpMyAdmin** | http://localhost:8091 | root / root |
| **MailHog** (emails) | http://localhost:8092 | — |
| **Documentation API** | http://localhost:8090/api/docs | — |

---



##  Tester les emails en développement

Les emails sont interceptés par **MailHog**. Ouvrir [http://localhost:8092](http://localhost:8092) pour voir tous les emails envoyés sans qu'ils arrivent en boîte réelle.

---

##  Configuration de l'IA (Groq)

1. Créer un compte sur [console.groq.com](https://console.groq.com)
2. Générer une clé API
3. L'ajouter dans `backend/.env` : `GROQ_API_KEY=gsk_...`
4. Vider le cache : `docker exec -it qsm_backend php bin/console cache:clear`

---

*Projet développé par **Aya Belmahi** et  **Wiame Bouziane**  — 2026*