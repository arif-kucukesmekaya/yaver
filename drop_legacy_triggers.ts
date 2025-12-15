
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('DATABASE_URL is not defined');
    process.exit(1);
}

const sql = postgres(connectionString);

async function main() {
    console.log('🗑️ Dropping legacy trigger and function...');

    try {
        // Drop function with CASCADE to remove associated triggers
        await sql`DROP FUNCTION IF EXISTS update_user_balance() CASCADE`;

        console.log('✅ Successfully dropped legacy function update_user_balance and associated triggers.');
    } catch (error) {
        console.error('❌ Error dropping triggers:', error);
    } finally {
        await sql.end();
    }
}

main();
