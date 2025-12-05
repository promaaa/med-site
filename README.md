# 📅 Système de Prise de Rendez-vous avec Google Calendar

Ce projet est un site médical avec un système de prise de rendez-vous intégré à Google Calendar.

## 🎯 Fonctionnalités

- ✅ **Réservation en ligne** : Les patients peuvent réserver des rendez-vous directement sur le site
- ✅ **Synchronisation Google Calendar** : Tous les rendez-vous sont automatiquement ajoutés à Google Calendar
- ✅ **Détection des conflits** : Le système vérifie automatiquement les disponibilités
- ✅ **Notifications automatiques** : Emails de confirmation et rappels
- ✅ **Interface d'administration** : Gestion des rendez-vous avec possibilité d'annulation
- ✅ **Authentification sécurisée** : Connexion admin avec NextAuth
- ✅ **Configuration via interface** : Upload du fichier JSON Google directement depuis l'admin
- ✅ **Base de données** : Sauvegarde locale avec Prisma + PostgreSQL

## 🚀 Démarrage rapide

### 1. Installation

```bash
npm install
```

### 2. Configuration de la base de données

```bash
# Configurez votre DATABASE_URL dans .env
DATABASE_URL="postgresql://user:password@localhost:5432/medsite"

# Créez les tables
npx prisma migrate dev --name init
```

### 3. Créer le compte administrateur

```bash
npm run create:admin
```

Identifiants créés :
- **Email** : `admin@drmartin.com`
- **Mot de passe** : `changeme123`

### 4. Configuration de Google Calendar

**Deux options disponibles :**

#### Option A : Via l'interface admin (Recommandé ✅)

1. Suivez le guide : **[SETUP_GOOGLE_CALENDAR.md](./SETUP_GOOGLE_CALENDAR.md)**
2. Lancez le serveur : `npm run dev`
3. Connectez-vous : http://localhost:3000/admin/login
4. Allez dans "⚙️ Configuration"
5. Uploadez votre fichier JSON Google
6. Testez la connexion

#### Option B : Via les variables d'environnement

Suivez le guide détaillé : **[GUIDE_COMPLET.md](./GUIDE_COMPLET.md)**

```bash
npm run dev
```

Visitez http://localhost:3000

## 📁 Structure du projet

```
med-site/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Page d'accueil
│   │   ├── book/page.tsx         # Page de réservation
│   │   ├── admin/page.tsx        # Dashboard admin
│   │   └── actions.ts            # Server actions (logique métier)
│   ├── components/
│   │   ├── BookingFlow.tsx       # Composant de réservation
│   │   ├── AppointmentsList.tsx  # Liste des rendez-vous
│   │   └── ui/                   # Composants UI (shadcn)
│   └── lib/
│       ├── googleCalendar.ts     # Intégration Google Calendar
│       └── prisma.ts             # Client Prisma
├── prisma/
│   └── schema.prisma             # Schéma de base de données
├── scripts/
│   └── test-calendar.ts          # Script de test
├── QUICKSTART.md                 # Guide de démarrage rapide
└── GOOGLE_CALENDAR_SETUP.md      # Guide détaillé Google Calendar
```

## 🔧 Configuration

### Variables d'environnement (.env)

```bash
# Google Calendar
GOOGLE_SERVICE_ACCOUNT_EMAIL=votre-compte@projet.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=primary  # Optionnel, par défaut 'primary'

# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/medsite"

# NextAuth (si authentification)
NEXTAUTH_SECRET=votre-secret
NEXTAUTH_URL=http://localhost:3000
```

### Personnalisation des horaires

Modifiez les horaires de travail dans `src/app/actions.ts` :

```typescript
const workStartHour = 9;   // Heure de début
const workEndHour = 17;    // Heure de fin
const slotDuration = 30;   // Durée des créneaux en minutes
```

### Fuseau horaire

Modifiez le fuseau horaire dans `src/lib/googleCalendar.ts` :

```typescript
timeZone: 'Europe/Paris', // Changez selon votre localisation
```

## 📱 Utilisation

### Pour les patients

1. Visitez `/book`
2. Sélectionnez une date
3. Choisissez un créneau horaire disponible
4. Remplissez vos coordonnées
5. Confirmez le rendez-vous

→ Un email de confirmation est envoyé automatiquement
→ L'événement apparaît dans Google Calendar

### Pour l'administrateur

1. Visitez `/admin`
2. Consultez tous les rendez-vous
3. Annulez un rendez-vous si nécessaire

→ L'annulation supprime l'événement de Google Calendar
→ Une notification est envoyée au patient

## 🔍 Comment ça fonctionne ?

### 1. Récupération des créneaux disponibles

```typescript
// src/app/actions.ts - getAvailableSlots()
1. Récupère les événements Google Calendar pour la date
2. Récupère les rendez-vous de la base de données
3. Génère tous les créneaux possibles (ex: 9h-17h par tranches de 30min)
4. Filtre les créneaux qui ne sont pas en conflit
5. Retourne la liste des créneaux disponibles
```

### 2. Création d'un rendez-vous

```typescript
// src/app/actions.ts - bookAppointment()
1. Valide les données du formulaire
2. Crée l'événement dans Google Calendar
3. Sauvegarde le rendez-vous dans la base de données
4. Envoie une notification par email
5. Retourne le statut de succès
```

### 3. Annulation d'un rendez-vous

```typescript
// src/app/actions.ts - cancelAppointment()
1. Récupère le rendez-vous depuis la base de données
2. Supprime l'événement de Google Calendar
3. Met à jour le statut en 'CANCELLED' dans la DB
4. Envoie une notification d'annulation
```

## 🛠️ Commandes utiles

```bash
# Développement
npm run dev              # Lancer le serveur de développement
npm run build            # Build de production
npm run start            # Lancer en production

# Base de données
npx prisma studio        # Interface graphique pour la DB
npx prisma migrate dev   # Créer une migration
npx prisma generate      # Générer le client Prisma

# Tests
npm run test:calendar    # Tester l'intégration Google Calendar
```

## 🐛 Dépannage

### Le calendrier est en mode MOCK

Vous verrez ce message dans les logs :
```
⚠️  Google Calendar en mode MOCK - Configurez vos identifiants dans .env
```

**Solution** : Configurez `GOOGLE_SERVICE_ACCOUNT_EMAIL` et `GOOGLE_PRIVATE_KEY` dans `.env`

### Erreur "Calendar API has not been used"

**Solution** : Activez l'API Google Calendar dans Google Cloud Console

### Erreur "Not Found" ou "Calendar not found"

**Solution** : Partagez votre calendrier avec l'email du compte de service

### Aucun créneau disponible

**Solutions** :
- Vérifiez que le calendrier est partagé avec le compte de service
- Vérifiez les horaires de travail dans `src/app/actions.ts`
- Vérifiez qu'il n'y a pas d'événements bloquant tous les créneaux

### Erreur de base de données

**Solution** : Vérifiez que PostgreSQL est lancé et que `DATABASE_URL` est correct

## 📚 Documentation

- [Guide de démarrage rapide](./QUICKSTART.md)
- [Configuration Google Calendar détaillée](./GOOGLE_CALENDAR_SETUP.md)
- [Documentation Google Calendar API](https://developers.google.com/calendar/api)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Next.js](https://nextjs.org/docs)

## 🎨 Technologies utilisées

- **Next.js 16** - Framework React
- **TypeScript** - Typage statique
- **Prisma** - ORM pour la base de données
- **PostgreSQL** - Base de données
- **Google Calendar API** - Synchronisation calendrier
- **Tailwind CSS** - Styling
- **shadcn/ui** - Composants UI
- **date-fns** - Manipulation de dates

## 📝 License

Ce projet est privé et destiné à un usage médical.

## 🤝 Support

Pour toute question ou problème :
1. Consultez la section [Dépannage](#-dépannage)
2. Vérifiez les guides de configuration
3. Consultez les logs du serveur pour plus de détails

---

Fait avec ❤️ pour faciliter la prise de rendez-vous médicaux