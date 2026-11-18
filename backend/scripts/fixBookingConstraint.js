/**
 * fixBookingConstraint.js
 * Drops the erroneous 'chk_number_of_tickets' CHECK constraint from the
 * bookings table in the live event_management database.
 *
 * Run once from the backend folder:
 *   node scripts/fixBookingConstraint.js
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const connection = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'event_management',
    port:     parseInt(process.env.DB_PORT, 10) || 3306,
  });

  try {
    console.log('Connected to database:', process.env.DB_NAME || 'event_management');

    // 1. Show the current table definition so we can confirm the constraint name
    const [rows] = await connection.query('SHOW CREATE TABLE bookings');
    const createSql = rows[0]['Create Table'];
    console.log('\n--- Current bookings table definition ---');
    console.log(createSql);
    console.log('-----------------------------------------\n');

    // 2. Check if the constraint exists before trying to drop it
    const constraintName = 'chk_number_of_tickets';
    if (!createSql.includes(constraintName)) {
      console.log(`Constraint "${constraintName}" not found – nothing to do.`);
      return;
    }

    // 3. Drop the CHECK constraint
    console.log(`Dropping CHECK constraint "${constraintName}" from bookings table...`);
    await connection.query(`ALTER TABLE bookings DROP CHECK \`${constraintName}\``);
    console.log('✅ Constraint dropped successfully!\n');

    // 4. Verify by showing the updated definition
    const [updated] = await connection.query('SHOW CREATE TABLE bookings');
    console.log('--- Updated bookings table definition ---');
    console.log(updated[0]['Create Table']);
    console.log('-----------------------------------------');
    console.log('\n✅ Fix complete. Booking with number_of_tickets = 1 will now work.');
  } catch (err) {
    console.error('❌ Error running fix script:', err.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
})();
