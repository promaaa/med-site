#!/usr/bin/env node

/**
 * Script de vérification de la configuration
 * Vérifie que toutes les variables d'environnement sont présentes
 */

const requiredEnvVars = [
    'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    'GOOGLE_PRIVATE_KEY',
    'DATABASE_URL',
];

const optionalEnvVars = [
    'GOOGLE_CALENDAR_ID',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
];

console.log('🔍 Vérification de la configuration...\n');

let hasErrors = false;
let hasWarnings = false;

// Vérifier les variables requises
console.log('📋 Variables requises :');
requiredEnvVars.forEach((varName) => {
    const value = process.env[varName];
    if (!value) {
        console.log(`  ❌ ${varName} : MANQUANT`);
        hasErrors = true;
    } else if (value.includes('your-') || value.includes('example')) {
        console.log(`  ⚠️  ${varName} : Valeur par défaut détectée`);
        hasWarnings = true;
    } else {
        console.log(`  ✅ ${varName} : Configuré`);
    }
});

console.log('\n📋 Variables optionnelles :');
optionalEnvVars.forEach((varName) => {
    const value = process.env[varName];
    if (!value) {
        console.log(`  ℹ️  ${varName} : Non configuré (optionnel)`);
    } else {
        console.log(`  ✅ ${varName} : Configuré`);
    }
});

// Vérifications spécifiques
console.log('\n🔐 Vérifications spécifiques :');

// Vérifier le format de la clé privée
const privateKey = process.env.GOOGLE_PRIVATE_KEY;
if (privateKey) {
    if (privateKey.includes('BEGIN PRIVATE KEY')) {
        console.log('  ✅ Format de la clé privée : Correct');
    } else {
        console.log('  ❌ Format de la clé privée : Incorrect (doit contenir BEGIN PRIVATE KEY)');
        hasErrors = true;
    }

    if (privateKey.includes('\\n')) {
        console.log('  ✅ Retours à la ligne : Présents');
    } else {
        console.log('  ⚠️  Retours à la ligne : Manquants (peut causer des erreurs)');
        hasWarnings = true;
    }
}

// Vérifier le format de l'email du compte de service
const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
if (serviceEmail) {
    if (serviceEmail.includes('@') && serviceEmail.includes('.iam.gserviceaccount.com')) {
        console.log('  ✅ Format de l\'email : Correct');
    } else {
        console.log('  ⚠️  Format de l\'email : Suspect (devrait se terminer par .iam.gserviceaccount.com)');
        hasWarnings = true;
    }
}

// Vérifier le format de DATABASE_URL
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
    if (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://')) {
        console.log('  ✅ Format de DATABASE_URL : Correct');
    } else {
        console.log('  ⚠️  Format de DATABASE_URL : Suspect (devrait commencer par postgresql://)');
        hasWarnings = true;
    }
}

// Résumé
console.log('\n' + '='.repeat(50));
if (hasErrors) {
    console.log('❌ Configuration incomplète !');
    console.log('\n📖 Actions requises :');
    console.log('  1. Consultez QUICKSTART.md pour la configuration');
    console.log('  2. Configurez les variables manquantes dans .env');
    console.log('  3. Relancez ce script pour vérifier');
    process.exit(1);
} else if (hasWarnings) {
    console.log('⚠️  Configuration présente mais avec des avertissements');
    console.log('\n💡 Recommandations :');
    console.log('  - Vérifiez les valeurs suspectes ci-dessus');
    console.log('  - Testez l\'intégration avec : npm run test:calendar');
    process.exit(0);
} else {
    console.log('✅ Configuration complète !');
    console.log('\n🎉 Prochaines étapes :');
    console.log('  1. Testez l\'intégration : npm run test:calendar');
    console.log('  2. Lancez le serveur : npm run dev');
    console.log('  3. Visitez http://localhost:3000/book');
    process.exit(0);
}
