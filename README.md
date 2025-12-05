# Site de Réservation Médicale

Application web de prise de rendez-vous pour cabinet médical.

**Stack technique** : Next.js 14, PostgreSQL, Prisma, NextAuth, Resend, Google Calendar API

---

## Table des matières

1. [Installation](#installation)
2. [Configuration de la base de données](#configuration-de-la-base-de-données)
3. [Configuration des emails avec Resend](#configuration-des-emails-avec-resend)
4. [Création du compte administrateur](#création-du-compte-administrateur)
5. [Configuration de Google Calendar](#configuration-de-google-calendar)
6. [Lancement](#lancement)
7. [Structure du projet](#structure-du-projet)

---

## Installation

```bash
git clone <repo>
cd med-site
npm install
cp .env.example .env
```

---

## Configuration de la base de données

### Option A : PostgreSQL local

1. Installer PostgreSQL sur votre machine
2. Créer une base de données :
   ```sql
   CREATE DATABASE med_site;
   ```
3. Modifier `DATABASE_URL` dans `.env` :
   ```
   DATABASE_URL="postgresql://postgres:votre_mot_de_passe@localhost:5432/med_site"
   ```

### Option B : Service cloud (Neon, Supabase, etc.)

1. Créer une base PostgreSQL sur le service de votre choix
2. Copier l'URL de connexion dans `.env`

### Initialisation du schéma

```bash
npx prisma generate
npx prisma db push
```

---

## Configuration des emails avec Resend

Les emails sont utilisés pour :
- Confirmation de rendez-vous
- Rappels automatiques (24h avant)
- Confirmation d'annulation

### Étapes de configuration

1. Créer un compte sur https://resend.com

2. Dans le dashboard Resend, aller dans "API Keys" et créer une nouvelle clé

3. Copier la clé dans `.env` :
   ```
   RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxx"
   ```

4. (Optionnel) Pour utiliser votre propre domaine d'envoi :
   - Aller dans "Domains" sur Resend
   - Ajouter votre domaine
   - Configurer les enregistrements DNS demandés
   - Modifier l'adresse d'expédition dans `src/lib/email.ts`

### Test des emails

En développement, les emails sont envoyés mais peuvent arriver en spam. Vérifiez le dossier spam ou utilisez un domaine vérifié pour la production.

---

## Création du compte administrateur

Le panel admin nécessite un compte authentifié.

```bash
npm run create:admin
```

Le script vous demandera :
- Email de l'administrateur
- Mot de passe (minimum 8 caractères)

Ces identifiants serviront à se connecter sur `/admin`.

### Configuration NextAuth

Générer un secret pour les sessions :

```bash
openssl rand -base64 32
```

Ajouter dans `.env` :
```
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="le_secret_généré"
```

En production, remplacer `NEXTAUTH_URL` par l'URL de votre site.

---

## Configuration de Google Calendar

La synchronisation Google Calendar est optionnelle. Elle permet de :
- Créer automatiquement les événements dans le calendrier du médecin
- Supprimer les événements lors d'annulation

### Étape 1 : Créer un projet Google Cloud

1. Aller sur https://console.cloud.google.com
2. Créer un nouveau projet (ex: "Cabinet Medical")
3. Sélectionner ce projet

### Étape 2 : Activer l'API Google Calendar

1. Menu > APIs & Services > Library
2. Rechercher "Google Calendar API"
3. Cliquer sur "Enable"

### Étape 3 : Créer un compte de service

1. Menu > APIs & Services > Credentials
2. Cliquer "Create Credentials" > "Service Account"
3. Nom : "calendar-sync" (ou autre)
4. Cliquer "Create and Continue" puis "Done"

### Étape 4 : Générer la clé JSON

1. Cliquer sur le compte de service créé
2. Onglet "Keys" > "Add Key" > "Create new key"
3. Format : JSON
4. Le fichier se télécharge automatiquement

### Étape 5 : Partager le calendrier

1. Ouvrir Google Calendar (calendar.google.com)
2. Clic droit sur le calendrier cible > "Paramètres et partage"
3. Section "Partager avec des personnes en particulier"
4. Ajouter l'email du compte de service (format : `xxx@xxx.iam.gserviceaccount.com`)
5. Permission : "Apporter des modifications aux événements"

### Étape 6 : Configurer dans l'application

1. Se connecter à `/admin`
2. Aller dans "Paramètres" > onglet "Calendrier"
3. Coller le contenu du fichier JSON téléchargé
4. Indiquer l'ID du calendrier (visible dans les paramètres du calendrier Google, ou "primary" pour le calendrier principal)
5. Sauvegarder

### Vérification

```bash
npm run test:calendar
```

Ce script teste la connexion et affiche les prochains événements.

---

## Lancement

### Développement

```bash
npm run dev
```

- Site public : http://localhost:3000
- Panel admin : http://localhost:3000/admin

### Production

```bash
npm run build
npm run start
```

---

## Structure du projet

```
src/
├── app/
│   ├── page.tsx              # Page d'accueil
│   ├── about/                # Page À propos
│   ├── services/             # Page Services
│   ├── contact/              # Page Contact
│   ├── book/                 # Réservation de rendez-vous
│   │   ├── page.tsx          # Formulaire de réservation
│   │   └── confirmation/     # Page de confirmation
│   ├── cancel/[token]/       # Annulation par lien unique
│   ├── admin/                # Panel d'administration
│   │   ├── page.tsx          # Tableau de bord
│   │   ├── calendar/         # Vue calendrier
│   │   ├── availability/     # Gestion des disponibilités
│   │   ├── stats/            # Statistiques
│   │   └── settings/         # Paramètres
│   └── api/                  # Routes API
│       ├── auth/             # Authentification NextAuth
│       └── admin/            # API admin (stats, settings, export)
│
├── components/
│   ├── ui/                   # Composants UI (button, input, calendar...)
│   ├── BookingFlow.tsx       # Flux de réservation
│   ├── PageHeader.tsx        # Header des pages
│   ├── Footer.tsx            # Footer
│   └── ...
│
├── lib/
│   ├── prisma.ts             # Client Prisma
│   ├── email.ts              # Envoi d'emails via Resend
│   ├── google-calendar.ts    # Intégration Google Calendar
│   ├── holidays.ts           # Jours fériés français
│   └── reminders.ts          # Système de rappels
│
└── middleware.ts             # Protection des routes /admin
```

---

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Lancer en production |
| `npm run create:admin` | Créer un compte administrateur |
| `npm run test:calendar` | Tester la connexion Google Calendar |
| `npm run check:config` | Vérifier la configuration |

---

## Personnalisation

### Modifier les informations du cabinet

Les informations (nom, adresse, téléphone) sont définies dans :
- `src/app/layout.tsx` (SEO et métadonnées)
- `src/components/Footer.tsx`
- `src/app/contact/page.tsx`
- `src/lib/email.ts` (templates d'emails)

### Modifier les horaires par défaut

Les horaires se configurent dans le panel admin > Paramètres, ou en modifiant les valeurs par défaut dans `prisma/schema.prisma`.

### Modifier les motifs de consultation

Les motifs sont configurables dans le panel admin > Paramètres > onglet "Motifs".