import controllers from '../controllers/index.js';
import sql from 'mssql';
import express from 'express';
import viteExpress from 'vite-express';
import session from 'express-session';

const app = express();
app.use(express.json());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 60000
    }
}));

const config = {
    user: 'SA',
    password: '<YourStrong@Passw0rd>',
    server: 'localhost',
    database: 'BANK',
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

sql.connect(config).then(pool => {
    console.log('Connected to MSSQL');

    app.locals.pool = pool;

    app.use('/api', controllers);

    const server = app.listen(3152, () => {
        console.log('Server is running on port 3152');
    });

    viteExpress.bind(app, server);
}).catch(err => {
    console.error('Connection Failed', err);
});



