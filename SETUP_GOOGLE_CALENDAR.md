# 🔧 Configuration Google Calendar - Guide Complet

## Étape 1 : Créer un projet Google Cloud

1. **Accédez à Google Cloud Console**
   - Allez sur : https://console.cloud.google.com/
   - Connectez-vous avec votre compte Google (celui du médecin)

2. **Créer un nouveau projet**
   - Cliquez sur le menu déroulant en haut (à côté de "Google Cloud")
   - Cliquez sur "NEW PROJECT" / "NOUVEAU PROJET"
   - Nom du projet : `med-site-calendar` (ou autre nom de votre choix)
   - Cliquez sur "CREATE" / "CRÉER"
   - Attendez quelques secondes que le projet soit créé

## Étape 2 : Activer l'API Google Calendar

1. **Rechercher l'API**
   - Dans la barre de recherche en haut, tapez : `Google Calendar API`
   - Cliquez sur "Google Calendar API" dans les résultats

2. **Activer l'API**
   - Cliquez sur le bouton "ENABLE" / "ACTIVER"
   - Attendez que l'activation soit terminée

## Étape 3 : Créer un compte de service (Service Account)

1. **Accéder aux credentials**
   - Dans le menu de gauche, allez à "APIs & Services" > "Credentials"
   - URL directe : https://console.cloud.google.com/apis/credentials

2. **Créer un compte de service**
   - Cliquez sur "+ CREATE CREDENTIALS" en haut
   - Sélectionnez "Service account" / "Compte de service"

3. **Remplir les informations**
   - **Service account name** : `calendar-service`
   - **Service account ID** : (sera généré automatiquement)
   - **Description** : `Service account for medical appointment calendar`
   - Cliquez sur "CREATE AND CONTINUE" / "CRÉER ET CONTINUER"

4. **Accorder les permissions (optionnel)**
   - Vous pouvez sauter cette étape
   - Cliquez sur "CONTINUE" / "CONTINUER"

5. **Terminer la création**
   - Cliquez sur "DONE" / "TERMINÉ"

## Étape 4 : Créer et télécharger la clé JSON

1. **Trouver votre compte de service**
   - Dans la page "Credentials", descendez à la section "Service Accounts"
   - Vous devriez voir `calendar-service@...`
   - Cliquez sur l'email du service account

2. **Créer une clé**
   - Allez dans l'onglet "KEYS" / "CLÉS"
   - Cliquez sur "ADD KEY" > "Create new key" / "AJOUTER UNE CLÉ" > "Créer une clé"
   - Sélectionnez le format "JSON"
   - Cliquez sur "CREATE" / "CRÉER"

3. **Télécharger la clé**
   - Un fichier JSON sera automatiquement téléchargé
   - **IMPORTANT** : Conservez ce fichier en sécurité !
   - Le nom du fichier sera quelque chose comme : `med-site-calendar-xxxxx.json`

## Étape 5 : Partager votre Google Calendar avec le compte de service

1. **Ouvrir Google Calendar**
   - Allez sur : https://calendar.google.com/
   - Connectez-vous avec le compte Gmail du médecin

2. **Trouver l'email du service account**
   - Ouvrez le fichier JSON téléchargé
   - Cherchez la ligne `"client_email"`
   - Copiez cette adresse email (elle ressemble à : `calendar-service@med-site-calendar-xxxxx.iam.gserviceaccount.com`)

3. **Partager le calendrier**
   - Dans Google Calendar, cliquez sur les trois points à côté de votre calendrier principal
   - Sélectionnez "Settings and sharing" / "Paramètres et partage"
   - Descendez à "Share with specific people" / "Partager avec des personnes spécifiques"
   - Cliquez sur "+ Add people" / "+ Ajouter des personnes"
   - Collez l'email du service account
   - Permissions : sélectionnez "Make changes to events" / "Modifier les événements"
   - Cliquez sur "Send" / "Envoyer"

## Étape 6 : Configuration via l'interface admin du site

**IMPORTANT** : Au lieu de modifier manuellement le fichier `.env`, vous allez maintenant pouvoir :

1. Se connecter à l'interface admin : http://localhost:3000/admin/login
2. Accéder aux paramètres
3. Uploader le fichier JSON téléchargé
4. Le système extraira automatiquement les informations nécessaires

Les informations suivantes seront extraites du fichier JSON :
- `client_email` : Email du compte de service
- `private_key` : Clé privée pour l'authentification
- `project_id` : ID du projet Google Cloud

## ✅ Vérification

Une fois configuré, vous pourrez tester :

1. **Test automatique**
   ```bash
   npm run test:calendar
   ```

2. **Test via l'interface**
   - Visitez : http://localhost:3000/book
   - Sélectionnez une date
   - Vous devriez voir les créneaux disponibles
   - Réservez un rendez-vous test
   - Vérifiez qu'il apparaît dans Google Calendar

## 🔒 Sécurité

- Le fichier JSON contient des informations sensibles
- Ne le partagez jamais
- Ne le commitez jamais dans Git (déjà dans `.gitignore`)
- Conservez-le dans un endroit sûr en cas de besoin futur

## 🐛 Dépannage

### "Calendar API has not been used"
- ✅ Vérifiez que l'API est bien activée (Étape 2)
- ✅ Attendez 1-2 minutes après l'activation

### "Calendar not found" ou "Not Found"
- ✅ Vérifiez que le calendrier est bien partagé (Étape 5)
- ✅ Vérifiez l'email du service account

### "Aucun créneau disponible"
- ✅ Vérifiez les horaires de travail dans les paramètres admin
- ✅ Vérifiez qu'il n'y a pas d'événements bloquant tous les créneaux dans Google Calendar

## 📞 Besoin d'aide ?

Si vous rencontrez des problèmes, vérifiez :
1. Les logs du serveur (`npm run dev`)
2. La console du navigateur (F12)
3. L'onglet "Configuration" dans l'admin
