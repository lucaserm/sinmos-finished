require('dotenv').config();
// 
const express = require('express');
const app = express();
const { Client } = require('pg');
const client = new Client({
    user: process.env.user, 
    password: process.env.password,
    host: process.env.host,
    port: process.env.porta,
    database: process.env.database
});
module.exports = client;

client.connect()
    .then(() => {
        console.log('Conectei à base de dados.');
        app.emit('Pronto.');
    })
    .catch(e => console.log(e));
const routes = require('./routes');
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'public')));
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(routes);
app.on('Pronto.', () => {
    app.listen(3000, () => {
        console.log(`Acessar em https://${process.env.host}:3000/`);
        console.log('Servidor rodando na porta 3000');
    });
});
