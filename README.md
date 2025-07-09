# CESIZEN Backend - Guide d'Installation

## Description

API Backend pour l'application CESIZEN développée avec [NestJS](https://nestjs.com/), utilisant PostgreSQL comme base de données et Prisma comme ORM.

## Prérequis

Avant de commencer l'installation, assurez-vous d'avoir les éléments suivants installés sur votre système :

- **Node.js** (version 18 ou supérieure) - [Télécharger Node.js](https://nodejs.org/)
- **npm** ou **yarn** (gestionnaire de paquets)
- **PostgreSQL** (version 12 ou supérieure) - [Télécharger PostgreSQL](https://www.postgresql.org/download/)
- **Docker** et **Docker Compose** (optionnel, pour l'installation avec conteneurs)

## Installation

### 1. Cloner le projet

```bash
git clone <url-du-repository>
cd backend-cesizen
```

### 2. Installation des dépendances

```bash
npm install
```

### 3. Configuration de l'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Base de données
DATABASE_URL="postgresql://cesizen_user:cesizen_password@localhost:5432/cesizen"

# JWT Configuration
JWT_SECRET="votre_jwt_secret_tres_securise"
JWT_EXPIRATION="7d"

# Configuration SMTP (pour l'envoi d'emails)
SMTP_USER="votre_email@gmail.com"
SMTP_PASS="votre_mot_de_passe_app"

# Environnement
NODE_ENV="development"
```

### 4. Configuration de la base de données

#### Option A : Installation locale de PostgreSQL

1. Créez une base de données PostgreSQL :
```sql
CREATE DATABASE cesizen;
CREATE USER cesizen_user WITH PASSWORD 'cesizen_password';
GRANT ALL PRIVILEGES ON DATABASE cesizen TO cesizen_user;
```

2. Exécutez les migrations Prisma :
```bash
npx prisma generate
npx prisma migrate deploy
```

3. (Optionnel) Alimentez la base avec des données de test :
```bash
npm run seed
```

#### Option B : Utilisation avec Docker

Si vous préférez utiliser Docker pour la base de données :

```bash
# Démarrer uniquement la base de données PostgreSQL
docker-compose -f docker-compose.prod.yml up db -d

# Attendre que la base soit prête, puis exécuter les migrations
npx prisma generate
npx prisma migrate deploy
npm run seed
```

## Démarrage de l'application

### Mode développement

```bash
# Démarrage avec rechargement automatique
npm run start:dev

# Démarrage avec mode debug
npm run start:debug
```

L'API sera accessible sur `http://localhost:2323`

### Mode production

```bash
# Compilation du projet
npm run build

# Démarrage en mode production
npm run start:prod
```

## Installation avec Docker

### Développement

Pour un environnement de développement complet avec Docker :

```bash
# Démarrer tous les services (base de données + backend)
docker-compose -f docker-compose.prod.yml up -d
```

### Production

```bash
# Construction et démarrage des conteneurs en production
docker-compose -f docker-compose.prod.yml up --build -d
```

## Scripts disponibles

```bash
# Développement
npm run start:dev          # Démarrage avec rechargement automatique
npm run start:debug        # Démarrage avec debugger

# Build et production
npm run build              # Compilation TypeScript
npm run start:prod         # Démarrage en mode production

# Base de données
npm run seed               # Alimentation de la base avec des données de test
npx prisma studio          # Interface graphique Prisma
npx prisma migrate dev     # Création de nouvelles migrations

# Tests
npm run test               # Tests unitaires
npm run test:watch         # Tests en mode watch
npm run test:e2e           # Tests end-to-end
npm run test:cov           # Couverture de tests

# Code quality
npm run format             # Formatage du code avec Prettier
npm run lint               # Vérification du code avec ESLint
```

## Structure de l'API

L'API expose les endpoints suivants :

- **Authentication** : `/auth` (login, register, reset password)
- **Users** : `/users` (gestion des utilisateurs)
- **Activities** : `/activities` (gestion des activités)
- **Information** : `/informations` (gestion des informations)
- **Favorites** : `/favorites` (gestion des favoris)

## Documentation API

Une fois l'application démarrée en mode "development", la documentation Swagger est disponible sur :
`http://localhost:2323/api`

## Dépannage

### Problèmes courants

1. **Erreur de connexion à la base de données**
   - Vérifiez que PostgreSQL est démarré
   - Vérifiez les paramètres de connexion dans le fichier `.env`

2. **Erreur lors des migrations Prisma**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Problèmes de dépendances**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Port déjà utilisé**
   - Changez le port dans le fichier `main.ts` ou tuez le processus utilisant le port 2323

### Logs et debugging

- Les logs de l'application sont affichés dans la console
- Pour plus de détails, utilisez `npm run start:debug`
- Avec Docker : `docker-compose logs backend`

## Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `DATABASE_URL` | URL de connexion PostgreSQL | - |
| `JWT_SECRET` | Clé secrète pour JWT | - |
| `JWT_EXPIRATION` | Durée de validité des tokens | 7d |
| `SMTP_USER` | Email pour l'envoi de mails | - |
| `SMTP_PASS` | Mot de passe email | - |
| `NODE_ENV` | Environnement d'exécution | development |

## Support

Pour toute question ou problème, n'hésitez pas à :
- Consulter la documentation NestJS
- Vérifier les issues du projet
- Contacter l'équipe de développement
