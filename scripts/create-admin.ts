// Script to create an admin user
// Run with: npx tsx scripts/create-admin.ts

import "dotenv/config";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

async function main() {
    console.log("🔧 Création du compte administrateur...\n");

    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        console.error("❌ DATABASE_URL non définie dans .env");
        console.log("\nAjoutez DATABASE_URL dans votre fichier .env, par exemple:");
        console.log('DATABASE_URL="postgresql://user:password@localhost:5432/medsite"');
        process.exit(1);
    }

    const pool = new Pool({ connectionString });

    const email = process.env.ADMIN_EMAIL || "admin@dr-martin.fr";
    const password = process.env.ADMIN_PASSWORD || "admin123";

    try {
        // Check if admin table exists
        const tableCheck = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'Admin'
            );
        `);

        if (!tableCheck.rows[0].exists) {
            console.error("❌ La table Admin n'existe pas.");
            console.log("\nExécutez d'abord: npx prisma migrate dev");
            process.exit(1);
        }

        // Check if admin already exists
        const existingAdmin = await pool.query(
            'SELECT * FROM "Admin" WHERE email = $1',
            [email]
        );

        if (existingAdmin.rows.length > 0) {
            console.log("⚠️  Un administrateur existe déjà avec cet email.");
            console.log("Email:", email);
            console.log("\n💡 Si vous avez oublié le mot de passe, supprimez-le avec:");
            console.log(`   DELETE FROM "Admin" WHERE email = '${email}';`);
            await pool.end();
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin
        await pool.query(
            'INSERT INTO "Admin" (id, email, password, "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW())',
            [crypto.randomUUID(), email, hashedPassword]
        );

        console.log("✅ Compte administrateur créé avec succès !\n");
        console.log("📧 Email:", email);
        console.log("🔑 Mot de passe:", password);
        console.log("\n⚠️  IMPORTANT : Changez ce mot de passe après la première connexion !\n");
        console.log("🔗 Connectez-vous sur : http://localhost:3000/admin/login\n");

    } catch (error: any) {
        console.error("❌ Erreur:", error.message);

        if (error.code === 'ECONNREFUSED') {
            console.log("\n💡 La base de données n'est pas accessible.");
            console.log("   Vérifiez que PostgreSQL est en cours d'exécution.");
        }

        process.exit(1);
    } finally {
        await pool.end();
    }
}

main();
