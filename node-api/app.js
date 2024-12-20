import express from 'express';
import mysql from 'mysql2/promise.js';
import cors from 'cors';

const app = express();
const db = mysql.createPool({
    host: 'mysql-app',
    user: 'root',
    password: '123456',
    port: '3306',
    database: 'multiapoyo'
});

app.use(cors());
app.use(express.json());
const port = 3000;

app.get('/', (req, res) => {
    res.json({ message: 'Hola Mundo con NODE' });
});

app.get('/initDB', async (req, res) => {
    const query1 = `
    CREATE TABLE IF NOT EXISTS gitUsers (
        id VARCHAR(255) PRIMARY KEY,                 
        login VARCHAR(255) NULL,                     
        avatar_url TEXT NULL,                         
        url TEXT NULL,                                
        html_url TEXT NULL,                           
        received_events_url TEXT NULL,                
        type VARCHAR(50) NULL,                        
        user_view_type VARCHAR(50) NULL,              
        site_admin VARCHAR(10) NULL,                  
        score INT NULL    
    )`;

    const query2 = `
    CREATE TABLE IF NOT EXISTS gitUserInfo (
        id INT PRIMARY KEY,
        login VARCHAR(255) NULL,
        avatar_url TEXT NULL,
        public_repos INT NULL,
        public_gists INT NULL,
        followers INT NULL,
        following INT NULL,
        created_at VARCHAR(255) NULL
    )`;

    try {
        await db.execute(query1);
        await db.execute(query2);
        res.json({ result: 'Las Tablas se crearon o ya existen' });
    } catch (err) {
        res.status(400).json({ result: 'Error al crear las tablas' });
    }
});

app.post('/saveUsers', async (req, res) => {
    const users = req.body;

    if (!Array.isArray(users)) {
        return res.status(400).json({ result: 'No se envio un array de usuarios' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        for (const user of users) {
            const {
                login, id, avatar_url, url, html_url,
                received_events_url, type, user_view_type,
                site_admin, score
            } = user;

            const [existingUser] = await connection.execute('SELECT id FROM gitUsers WHERE id = ?', [id]);

            if (existingUser.length > 0) {
                continue;
            }

            const query = `
                INSERT INTO gitUsers (
                    id, login, avatar_url, url, html_url,
                    received_events_url, type, user_view_type, site_admin, score
                ) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            await connection.execute(query, [
                id, login, avatar_url, url, html_url,
                received_events_url, type, user_view_type, site_admin, score
            ]);
        }

        await connection.commit();
        res.json({ result: 'Usuarios ingresados a la base de datos' });

    } catch (err) {
        console.error(err);
        await connection.rollback();
        res.status(400).json({ result: 'Error al insertar los usuarios' });
    } finally {
        connection.release();
    }
});

app.post('/saveUserInfo', async (req, res) => {
    const user = req.body;

    const connection = await db.getConnection();

    try {
        const {
            login, id, avatar_url, public_repos, public_gists,
            followers, following, created_at
        } = user;

        const [existingUser] = await connection.execute('SELECT id FROM gitUserInfo WHERE id = ?', [id]);

        if (existingUser.length > 0) {
            return res.status(400).json({ result: 'El usuario ya existe en la base de datos' });
        }

        const query = `
        INSERT INTO gitUserInfo (
            id, login, avatar_url, public_repos, public_gists, 
            followers, following, created_at
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;


        await connection.execute(query, [
            id, login, avatar_url, public_repos, public_gists,
            followers, following, created_at
        ]);

        res.json({ result: 'Usuario ingresado a la base de datos' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ result: 'Error al insertar los usuarios' });
    } finally {
        connection.release();
    }
});

app.get('/getUsers', async (req, res) => {
    try {
        const [users] = await db.execute('SELECT * FROM gitUsers');
        res.json({ data: users });
    } catch (err) {
        res.status(400).json({ result: 'Error al obtener los usuarios' });
    }
});

app.get('/getFollowers', async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, login, followers FROM gitUserInfo ORDER BY followers DESC LIMIT 10;');
        res.json({ data: users });
    } catch (err) {
        res.status(400).json({ result: 'Error al obtener los usuarios' });
    }
});

app.get('/getFollowing', async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, login, following FROM gitUserInfo ORDER BY following DESC LIMIT 10;');
        res.json({ data: users });
    } catch (err) {
        res.status(400).json({ result: 'Error al obtener los usuarios' });
    }
});

app.get('/getScore', async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, login, score FROM gitUsers ORDER BY score  DESC LIMIT 10;');
        res.json({ data: users });
    } catch (err) {
        res.status(400).json({ result: 'Error al obtener los usuarios' });
    }
});

app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
});
