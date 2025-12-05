/**
 * Script de test pour vérifier la configuration Google Calendar
 * Usage: npx tsx scripts/test-calendar.ts
 */

import { listEvents, createEvent, deleteEvent } from '../src/lib/googleCalendar';
import { addDays, startOfDay, endOfDay } from 'date-fns';

async function testCalendarIntegration() {
    console.log('🧪 Test de l\'intégration Google Calendar\n');

    try {
        // Test 1: Lister les événements
        console.log('📅 Test 1: Récupération des événements...');
        const today = new Date();
        const events = await listEvents(startOfDay(today), endOfDay(addDays(today, 7)));
        console.log(`   ✅ ${events.length} événements trouvés pour les 7 prochains jours\n`);

        // Test 2: Créer un événement de test
        console.log('➕ Test 2: Création d\'un événement de test...');
        const testStart = new Date();
        testStart.setHours(testStart.getHours() + 1);
        const testEnd = new Date(testStart);
        testEnd.setMinutes(testEnd.getMinutes() + 30);

        const testEvent = await createEvent(
            testStart,
            testEnd,
            '🧪 Test - Rendez-vous médical',
            'Ceci est un événement de test créé automatiquement. Vous pouvez le supprimer.'
        );
        console.log(`   ✅ Événement créé avec l'ID: ${testEvent.id}\n`);

        // Test 3: Supprimer l'événement de test
        console.log('🗑️  Test 3: Suppression de l\'événement de test...');
        if (testEvent.id) {
            await deleteEvent(testEvent.id);
            console.log('   ✅ Événement supprimé avec succès\n');
        }

        console.log('✅ Tous les tests sont passés avec succès!');
        console.log('🎉 Votre intégration Google Calendar est fonctionnelle!\n');

    } catch (error: any) {
        console.error('\n❌ Erreur lors des tests:', error.message);
        console.error('\n📖 Consultez GOOGLE_CALENDAR_SETUP.md pour résoudre les problèmes\n');

        if (error.message?.includes('Missing Google Calendar credentials')) {
            console.error('💡 Action requise: Configurez vos identifiants Google dans le fichier .env');
        } else if (error.message?.includes('Calendar API has not been used')) {
            console.error('💡 Action requise: Activez l\'API Google Calendar dans Google Cloud Console');
        } else if (error.message?.includes('Not Found')) {
            console.error('💡 Action requise: Partagez votre calendrier avec le compte de service');
        }

        process.exit(1);
    }
}

testCalendarIntegration();
