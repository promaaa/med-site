# Guide de Mise en Place - Cabinet Dr. Martin

## 📋 Vue d'ensemble

Ce guide vous explique comment configurer et faire fonctionner le site du cabinet médical avec :
- Le site public pour les patients
- Le système de prise de rendez-vous
- Le dashboard administrateur
- L'intégration Google Calendar (optionnel)

---

## ✅ Ce qui est déjà configuré

Après nos modifications, voici l'état actuel :

| Fonctionnalité | Statut |
|----------------|--------|
| Site public | ✅ Opérationnel |
| Prise de rendez-vous | ✅ Opérationnel |
| Base de données PostgreSQL | ✅ Configurée |
| Dashboard admin | ✅ Opérationnel |
| Authentification admin | ✅ Configurée |
| Compte admin créé | ✅ Créé |
| Google Calendar | ⚠️ Optionnel (voir section dédiée) |

---

## 🚀 Lancer le site

### Démarrer le serveur de développement

```bash
cd /Users/promaa/Documents/code/med-site
npm run dev
```

### URLs disponibles

| Page | URL |
|------|-----|
| Accueil | http://localhost:3000 |
| Services | http://localhost:3000/services |
| À Propos | http://localhost:3000/about |
| Contact | http://localhost:3000/contact |
| Réservation | http://localhost:3000/book |
| **Admin Login** | http://localhost:3000/admin/login |
| **Dashboard** | http://localhost:3000/admin |

---

## 🔐 Connexion Administrateur

### Identifiants actuels

```
Email: admin@dr-martin.fr
Mot de passe: admin123
```

### Changer le mot de passe

Pour créer un nouvel admin avec un autre mot de passe :

```bash
# Définir les variables
export ADMIN_EMAIL="votre-email@example.com"
export ADMIN_PASSWORD="votre-mot-de-passe-securise"

# Créer l'admin
npm run create:admin
```

---

## 📊 Dashboard Administrateur

### Fonctionnalités disponibles

1. **Tableau de bord** (`/admin`)
   - Vue des statistiques (RDV aujourd'hui, à venir, etc.)
   - Prochain rendez-vous en surbrillance
   - Liste des rendez-vous du jour
   - Liste complète avec possibilité d'annulation

2. **Disponibilités** (`/admin/availability`)
   - Configuration des horaires matin/après-midi par jour
   - Activation/désactivation de jours
   - Jours de fermeture exceptionnelle

3. **Configuration** (`/admin/settings`)
   - Horaires de travail
   - Durée des créneaux
   - Configuration Google Calendar

---

## 📅 Intégration Google Calendar (Optionnel)

L'intégration Google Calendar permet de synchroniser les rendez-vous avec votre agenda Google.

### Étape 1 : Créer un projet Google Cloud

1. Allez sur https://console.cloud.google.com/
2. Créez un nouveau projet (ex: "Cabinet Dr Martin")
3. Activez l'API Google Calendar
4. Créez un compte de service (Service Account)
5. Téléchargez le fichier JSON des credentials

### Étape 2 : Partager le calendrier

1. Dans Google Calendar, allez dans les paramètres
2. Partagez votre calendrier avec l'email du compte de service
3. Donnez les droits "Apporter des modifications aux événements"

### Étape 3 : Uploader les credentials

1. Connectez-vous à `/admin/settings`
2. Uploadez le fichier JSON téléchargé
3. Cliquez sur "Tester la connexion"

**📖 Documentation détaillée :** Voir `SETUP_GOOGLE_CALENDAR.md`

---

## 🛠️ Commandes Utiles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarrer le serveur de développement |
| `npm run build` | Compiler pour production |
| `npm run start` | Démarrer en mode production |
| `npm run create:admin` | Créer un compte administrateur |
| `npx prisma studio` | Interface graphique base de données |
| `npx prisma db push` | Synchroniser le schéma BDD |

---

## 🗄️ Base de Données

### Vérifier la connexion

```bash
npx prisma studio
```

Cela ouvre une interface web pour visualiser vos données.

### Réinitialiser la base (⚠️ supprime tout)

```bash
npx prisma db push --force-reset
npm run create:admin
```

---

## 📁 Structure du Projet

```
med-site/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Page d'accueil
│   │   ├── book/              # Prise de rendez-vous
│   │   ├── services/          # Page services
│   │   ├── about/             # Page à propos
│   │   ├── contact/           # Page contact
│   │   ├── admin/             # Dashboard admin
│   │   │   ├── page.tsx       # Tableau de bord
│   │   │   ├── availability/  # Gestion disponibilités
│   │   │   ├── settings/      # Configuration
│   │   │   └── login/         # Page de connexion
│   │   └── api/               # Routes API
│   ├── components/            # Composants React
│   └── lib/                   # Utilitaires (Prisma, Google Calendar)
├── prisma/
│   └── schema.prisma          # Schéma base de données
├── public/                    # Fichiers statiques
└── .env                       # Variables d'environnement
```

---

## ⚙️ Variables d'Environnement (.env)

```env
# Base de données (obligatoire)
DATABASE_URL="postgresql://promaa@localhost:5432/medsite"

# NextAuth (l'application fonctionne avec la valeur par défaut)
NEXTAUTH_SECRET="votre-secret-en-production"
NEXTAUTH_URL="http://localhost:3000"

# Google Calendar (optionnel)
GOOGLE_SERVICE_ACCOUNT_EMAIL="votre-compte@projet.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID="primary"
```

---

## 🚨 Problèmes Fréquents

### "Database connection refused"
→ PostgreSQL n'est pas démarré
```bash
brew services start postgresql@16
```

### "Admin not found" lors de la connexion
→ L'admin n'a pas été créé
```bash
npm run create:admin
```

### Les rendez-vous ne s'enregistrent pas
→ Vérifiez la connexion base de données avec `npx prisma studio`

### Page blanche sur /admin
→ Redémarrez le serveur de développement
```bash
# Ctrl+C pour arrêter
npm run dev
```

---

## 🌐 Mise en Production

Pour déployer le site en production :

1. **Hébergement recommandé :** Vercel (gratuit pour projets personnels)
2. **Base de données :** Neon, Supabase, ou Railway (PostgreSQL hébergé)

### Déployer sur Vercel

```bash
npm i -g vercel
vercel
```

Configurez les variables d'environnement dans le dashboard Vercel.

---

## 📞 Support

Pour toute question technique, consultez :
- `README.md` - Documentation générale
- `ARCHITECTURE.md` - Architecture technique
- `SETUP_GOOGLE_CALENDAR.md` - Configuration Google Calendar

---

*Guide généré le 4 décembre 2025*
