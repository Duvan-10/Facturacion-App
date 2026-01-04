import mysql from 'mysql2/promise';

const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'apps_facturacion',
    port: 3306
};

const testUser = {
    identification: '1095832991',
};

async function checkUser() {
    let dbConnection;
    try {
        dbConnection = await mysql.createConnection(dbConfig);
        const [rows] = await dbConnection.execute(
            'SELECT * FROM users WHERE identification = ?',
            [testUser.identification]
        );

        if (rows.length > 0) {
            console.log(`User with identification ${testUser.identification} found in the database.`);
            console.log(rows[0]);
        } else {
            console.log(`User with identification ${testUser.identification} not found in the database.`);
        }
    } catch (error) {
        console.error('Error connecting to the database:', error);
    } finally {
        if (dbConnection) {
            await dbConnection.end();
        }
    }
}

checkUser();
