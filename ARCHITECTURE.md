# 🔄 Flux de fonctionnement du système de rendez-vous

## Vue d'ensemble

```
┌─────────────┐         ┌──────────────┐         ┌─────────────────┐
│   Patient   │────────▶│  Site Web    │────────▶│ Google Calendar │
│             │         │  (Next.js)   │         │                 │
└─────────────┘         └──────────────┘         └─────────────────┘
                               │
                               │
                               ▼
                        ┌──────────────┐
                        │  PostgreSQL  │
                        │  (Prisma)    │
                        └──────────────┘
```

## 📋 Flux détaillé de réservation

### 1. Patient visite la page de réservation (`/book`)

```
GET /book
  │
  ├─▶ Affiche le calendrier
  └─▶ Attend la sélection d'une date
```

### 2. Patient sélectionne une date

```
Patient clique sur une date
  │
  ├─▶ Appel à getAvailableSlots(date)
  │     │
  │     ├─▶ Récupère les événements Google Calendar
  │     │     └─▶ listEvents(startOfDay, endOfDay)
  │     │
  │     ├─▶ Récupère les rendez-vous de la DB
  │     │     └─▶ prisma.appointment.findMany()
  │     │
  │     ├─▶ Génère tous les créneaux (9h-17h, 30min)
  │     │
  │     └─▶ Filtre les créneaux disponibles
  │           └─▶ Retourne ['09:00', '09:30', '10:00', ...]
  │
  └─▶ Affiche les créneaux disponibles
```

### 3. Patient sélectionne un créneau et remplit le formulaire

```
Patient remplit :
  - Nom
  - Email
  - Téléphone
  - Raison de la visite
  
Patient clique sur "CONFIRMER LE RENDEZ-VOUS"
```

### 4. Création du rendez-vous

```
bookAppointment(formData)
  │
  ├─▶ 1. Crée l'événement dans Google Calendar
  │     │
  │     └─▶ createEvent(startTime, endTime, summary, description)
  │           │
  │           ├─▶ Crée l'événement avec :
  │           │     - Titre : "Appointment with [Nom]"
  │           │     - Description : Raison, téléphone, email
  │           │     - Notifications : 1 jour + 30 min avant
  │           │
  │           └─▶ Retourne { id: "google-event-id-123" }
  │
  ├─▶ 2. Sauvegarde dans la base de données
  │     │
  │     └─▶ prisma.appointment.create({
  │           startTime, endTime, patientName, patientEmail,
  │           patientPhone, reason, googleEventId, status: 'CONFIRMED'
  │         })
  │
  └─▶ 3. Retourne { success: true }
        │
        └─▶ Affiche "RENDEZ-VOUS CONFIRMÉ"
```

### 5. Notifications automatiques

```
Google Calendar envoie automatiquement :
  │
  ├─▶ Email de confirmation immédiat
  ├─▶ Rappel 1 jour avant (email)
  └─▶ Rappel 30 minutes avant (popup)
```

## 🔍 Flux de consultation (Admin)

### 1. Admin visite le dashboard (`/admin`)

```
GET /admin
  │
  ├─▶ getAllAppointments()
  │     │
  │     └─▶ prisma.appointment.findMany({ orderBy: { startTime: 'asc' } })
  │
  └─▶ Affiche la liste des rendez-vous
```

### 2. Admin annule un rendez-vous

```
Admin clique sur "Annuler le rendez-vous"
  │
  ├─▶ Confirmation : "Êtes-vous sûr ?"
  │
  └─▶ cancelAppointment(id)
        │
        ├─▶ 1. Récupère le rendez-vous
        │     └─▶ prisma.appointment.findUnique({ where: { id } })
        │
        ├─▶ 2. Supprime de Google Calendar
        │     └─▶ deleteEvent(googleEventId)
        │           └─▶ Envoie notification d'annulation
        │
        ├─▶ 3. Met à jour la DB
        │     └─▶ prisma.appointment.update({
        │           where: { id },
        │           data: { status: 'CANCELLED' }
        │         })
        │
        └─▶ 4. Rafraîchit la page
              └─▶ revalidatePath('/admin')
```

## 🔐 Sécurité et authentification

### Authentification Google Calendar

```
Service Account (compte de service)
  │
  ├─▶ Email : service-account@project.iam.gserviceaccount.com
  ├─▶ Clé privée : Stockée dans .env (GOOGLE_PRIVATE_KEY)
  │
  └─▶ JWT Authentication
        │
        ├─▶ google.auth.JWT({ email, key, scopes })
        │
        └─▶ Accès au calendrier partagé
```

### Permissions requises

```
Google Calendar API
  │
  ├─▶ Scope : 'https://www.googleapis.com/auth/calendar'
  │
  └─▶ Permissions sur le calendrier :
        └─▶ "Make changes to events" (Modifier les événements)
```

## 📊 Gestion des conflits

### Détection des créneaux occupés

```
Pour chaque créneau (ex: 10:00-10:30) :
  │
  ├─▶ Vérifier Google Calendar
  │     │
  │     └─▶ Y a-t-il un événement qui chevauche ?
  │           ├─▶ OUI → Créneau occupé ❌
  │           └─▶ NON → Continuer
  │
  ├─▶ Vérifier la base de données
  │     │
  │     └─▶ Y a-t-il un rendez-vous confirmé qui chevauche ?
  │           ├─▶ OUI → Créneau occupé ❌
  │           └─▶ NON → Créneau disponible ✅
  │
  └─▶ Ajouter à la liste des créneaux disponibles
```

### Logique de chevauchement

```typescript
// Un créneau chevauche si :
(slotStart >= eventStart && slotStart < eventEnd) ||
(slotEnd > eventStart && slotEnd <= eventEnd)

// Exemple :
Événement : 10:00 - 11:00
Créneau   : 10:30 - 11:00
Résultat  : CHEVAUCHE ❌

Événement : 10:00 - 10:30
Créneau   : 10:30 - 11:00
Résultat  : NE CHEVAUCHE PAS ✅
```

## 🔄 Synchronisation bidirectionnelle

### Événements créés manuellement dans Google Calendar

```
Admin crée un événement dans Google Calendar
  │
  └─▶ Lors de getAvailableSlots() :
        │
        ├─▶ listEvents() récupère TOUS les événements
        │     (y compris ceux créés manuellement)
        │
        └─▶ Ces créneaux sont marqués comme occupés
              └─▶ Patients ne peuvent pas les réserver ✅
```

### Événements créés via le site

```
Patient réserve via le site
  │
  ├─▶ Crée dans Google Calendar
  │     └─▶ Visible dans l'interface Google Calendar
  │
  └─▶ Sauvegarde dans la DB
        └─▶ Visible dans /admin
```

## 🎯 Points clés

1. **Double sauvegarde** : Google Calendar + Base de données
   - Google Calendar = Source de vérité pour les disponibilités
   - Base de données = Informations détaillées des patients

2. **Mode MOCK** : Si pas de credentials, fonctionne sans Google Calendar
   - Utile pour le développement
   - Les créneaux sont générés mais pas synchronisés

3. **Notifications automatiques** : Gérées par Google Calendar
   - Email de confirmation
   - Rappels avant le rendez-vous

4. **Gestion des fuseaux horaires** : Europe/Paris par défaut
   - Configurable dans `src/lib/googleCalendar.ts`

5. **Durée des créneaux** : 30 minutes par défaut
   - Configurable dans `src/app/actions.ts`

## 🚀 Prochaines améliorations possibles

- [ ] Ajout d'un système de rappels SMS
- [ ] Possibilité de reprogrammer un rendez-vous
- [ ] Gestion de plusieurs médecins/calendriers
- [ ] Horaires personnalisés par jour de la semaine
- [ ] Intégration avec un système de paiement
- [ ] Historique des rendez-vous pour les patients
- [ ] Statistiques et analytics pour l'admin
