// test-db.js - Method 3: SQL Authentication
const sql = require('mssql');
require('dotenv').config();

console.log('📝 Environment Variables:');
console.log(`DB_USER: "${process.env.DB_USER}"`);
console.log(`DB_SERVER: "${process.env.DB_SERVER}"`);
console.log(`DB_DATABASE: "${process.env.DB_DATABASE}"`);
console.log('');

const config = {
    user: process.env.DB_USER || 'smartrupi_user',
    password: process.env.DB_PASSWORD || 'SmartRupi@2026',
    server: process.env.DB_SERVER || 'TEESHA\\SQLEXPRESS',
    database: process.env.DB_DATABASE || 'SmartRupiDB',
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

async function testConnection() {
    console.log('🔌 Testing SQL Server Connection...');
    console.log(`📡 Server: ${config.server}`);
    console.log(`📊 Database: ${config.database}`);
    console.log(`👤 User: ${config.user}`);
    console.log('');

    try {
        const pool = await sql.connect(config);
        console.log('✅ CONNECTION SUCCESSFUL!');
        
        const result = await pool.request().query('SELECT SYSTEM_USER as [User]');
        console.log(`👤 Connected as: ${result.recordset[0].User}`);
        
        await pool.close();
        console.log('🔒 Connection closed');
        console.log('');
        console.log('✅ TEST COMPLETE - Database connection works!');
    } catch (err) {
        console.error('❌ CONNECTION FAILED:');
        console.error(`   Error: ${err.message}`);
        console.log('');
        console.log('💡 TIPS:');
        console.log('   Make sure the SQL login was created in SSMS');
    }
}

testConnection();