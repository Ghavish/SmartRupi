// db.js - SQL Server Connection
require('dotenv').config();
const sql = require('mssql');

console.log('🔍 ===== DB.JS DEBUG =====');
console.log('DB_USER from env:', process.env.DB_USER);
console.log('DB_SERVER from env:', process.env.DB_SERVER);
console.log('DB_DATABASE from env:', process.env.DB_DATABASE);
console.log('===========================');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectTimeout: 30000,
        requestTimeout: 30000
    }
};

console.log('🔍 Config object:', {
    user: config.user,
    server: config.server,
    database: config.database
});

let pool = null;

async function getConnection() {
    try {
        if (pool) {
            console.log('♻️ Using existing connection pool');
            return pool;
        }
        console.log('🔄 Creating new connection pool...');
        console.log(`📡 Connecting to: ${config.server}`);
        console.log(`📊 Database: ${config.database}`);
        console.log(`👤 User: ${config.user}`);
        
        pool = await sql.connect(config);
        console.log('✅ Connected to SQL Server successfully!');
        return pool;
    } catch (err) {
        console.error('❌ Database connection failed:');
        console.error(`   Error: ${err.message}`);
        console.error(`   Code: ${err.code || 'N/A'}`);
        console.error(`   State: ${err.state || 'N/A'}`);
        throw err;
    }
}

module.exports = { getConnection, sql };