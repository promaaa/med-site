# 🚀 Guide Complet : Configuration du Système de Rendez-vous

## Fonctionnalités créées

✅ **Système d'authentification complet**
- Page de connexion admin sécurisée
- Protection des routes avec NextAuth
- Gestion de session persistante

✅ **Interface de configuration Google Calendar**
- Upload du fichier JSON du compte de service
- Test de connexion intégré
- Gestion des horaires de travail
- Configuration des créneaux de rendez-vous

## 📋 ÉTAPES D'INSTALLATION

### 1. Configuration de la Base de Données

**Si vous utilisez PostgreSQL local :**
```bash
# Démarrez PostgreSQL
# Puis créez la base de données
npx prisma migrate dev --name init
```

**Si vous utilisez une autre base (Supabase, Neon, etc.) :**
1. Créez votre base de données
2. Mettez à jour `DATABASE_URL` dans `.env`
3. Exécutez les migrations :
```bash
npx prisma migrate dev --name init
```

### 2. Créer le Compte Administrateur

```bash
npm run create:admin
```

Cela créera un compte avec :
- **Email** : `admin@drmartin.com`
- **Mot de passe** : `changeme123`

> ⚠️ **Changez ce mot de passe après la première connexion !**

### 3. Configuration de Google Calendar

Il y a **deux méthodes** pour configurer Google Calendar :

#### Méthode A : Via l'Interface Admin (Recommandé ✅)

1. **Préparez le fichier JSON Google** (suivez `SETUP_GOOGLE_CALENDAR.md`)
   - Allez sur Google Cloud Console
   - Créez un projet
   - Activez l'API Google Calendar
   - Créez un compte de service
   - Téléchargez le fichier JSON

2. **Connectez-vous à l'admin**
   ```
   http://localhost:3000/admin/login
   ```

3. **Accédez aux paramètres**
   - Cliquez sur "⚙️ Configuration" dans le menu latéral

4. **Uploadez le fichier JSON**
   - Section "Google Calendar"
   - Sélectionnez votre fichier JSON
   - Cliquez sur "Uploader la configuration"

5. **Partagez votre calendrier**
   - Allez sur https://calendar.google.com
   - Partagez votre calendrier avec l'email du service account
   - Permissions : "Modifier les événements"

6. **Testez la connexion**
   - Cliquez sur "Tester la connexion"
   - Vous devriez voir : "✅ Connexion Google Calendar : OK"

#### Méthode B : Via les Variables d'Environnement

1. Ouvrez le fichier `.env`
2. Ajoutez/modifiez ces variables :

```env
# Google Calendar
GOOGLE_SERVICE_ACCOUNT_EMAIL=votre-service-account@projet.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=primary

# NextAuth
NEXTAUTH_SECRET=votre-secret-aleatoire-tres-long
NEXTAUTH_URL=http://localhost:3000

# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/medsite"
```

3. Redémarrez le serveur :
```bash
# Arrêtez npm run dev (Ctrl+C)
npm run dev
```

### 4. Configuration des Horaires

Dans l'interface admin > Configuration :

- **Heure de début** : 9 (9h00)
- **Heure de fin** : 17 (17h00)
- **Durée des créneaux** : 30 minutes

Cliquez sur "Enregistrer les paramètres"

## 🧪 TESTER LE SYSTÈME

### Test 1 : Vérifier l'authentification

```
1. Allez sur http://localhost:3000/admin
2. Vous devriez être redirigé vers /admin/login
3. Connectez-vous avec vos identifiants
4. Vous devriez accéder au dashboard
```

### Test 2 : Vérifier Google Calendar (via interface)

```
1. Admin > Configuration
2. Cliquez sur "Tester la connexion"
3. Résultat attendu : "✅ Connexion Google Calendar : OK"
```

### Test 3 : Vérifier Google Calendar (via terminal)

```bash
npm run test:calendar
```

Résultat attendu :
```
✅ Événement de test créé
✅ Événement de test supprimé
✅ Tous les tests sont passés avec succès!
```

### Test 4 : Réserver un rendez-vous

```
1. Allez sur http://localhost:3000/book
2. Sélectionnez une date
3. Choisissez un créneau
4. Remplissez le formulaire
5. Confirmez

Vérifications :
- Le rendez-vous apparaît dans /admin
- Le rendez-vous apparaît dans Google Calendar
- Vous recevez un email de confirmation
```

## 📱 UTILISATION QUOTIDIENNE

### Pour le Médecin

**Accès à l'admin :**
```
http://localhost:3000/admin/login
```

**Fonctionnalités disponibles :**
- 📅 **Rendez-vous** : Voir tous les rendez-vous, annuler si nécessaire
- 🕐 **Disponibilité** : Gérer les horaires (à venir)
- ⚙️ **Configuration** : Gérer la connexion Google Calendar et les horaires

### Pour les Patients

**Prise de rendez-vous :**
```
http://localhost:3000/book
```

**Navigation :**
- Page d'accueil : Informations générales
- Services : Liste des services médicaux
- À Propos : Information sur le médecin
- Contact : Coordonnées et formulaire

## 🔒 SÉCURITÉ

### Changement de Mot de Passe Admin

**TODO** : Ajouter une page de gestion du profil admin avec changement de mot de passe.

En attendant, vous pouvez :
1. Utiliser un outil comme `bcrypt-cli` pour hasher un nouveau mot de passe
2. Mettre à jour directement dans la base de données

### Variables d'Environnement Sensibles

Assurez-vous que ces variables sont dans `.env` et jamais dans Git :
- `GOOGLE_PRIVATE_KEY`
- `NEXTAUTH_SECRET`
- `DATABASE_URL`

## 🐛 DÉPANNAGE

### Erreur : "Can't reach database server"
- Vérifiez que PostgreSQL est démarré
- Vérifiez `DATABASE_URL` dans `.env`
- Testez la connexion : `npx prisma db pull`

### Erreur : "Calendar API has not been used"
- Attendez 1-2 minutes après l'activation
- Vérifiez que l'API est activée dans Google Cloud Console
- URL : https://console.cloud.google.com/apis/library/calendar-json.googleapis.com

### Erreur : "Calendar not found"
- Vérifiez que le calendrier est partagé avec le service account
- Vérifiez l'email du service account (affiché dans Configuration)
- Permissions requises : "Modifier les événements"

### Erreur : "Unauthorized" lors de l'accès admin
- Vérifiez que vous êtes connecté
- Effacez les cookies et reconnectez-vous
- Vérifiez que `NEXTAUTH_SECRET` est défini dans `.env`

### Pas de créneaux disponibles
- Vérifiez les horaires dans Configuration
- Vérifiez que Google Calendar n'a pas d'événements bloquant tous les créneaux
- Vérifiez que la date sélectionnée n'est pas dans le passé

## 📞 SUPPORT

Pour toute question :
1. Consultez `SETUP_GOOGLE_CALENDAR.md` pour la configuration Google
2. Consultez `ARCHITECTURE.md` pour comprendre le fonctionnement
3. Vérifiez les logs dans la console (F12) et le terminal

## 🎯 PROCHAINES ÉTAPES

- [ ] Page de gestion du profil admin
- [ ] Changement de mot de passe
- [ ] Gestion des disponibilités par jour de la semaine
- [ ] Notifications SMS
- [ ] Reprograamation de rendez-vous
- [ ] Statistiques et rapports

---

**Bravo ! Votre système de rendez-vous est maintenant opérationnel ! 🎉**
