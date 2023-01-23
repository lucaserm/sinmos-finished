require('dotenv').config();
// 
const express = require('express');
const app = express();
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.pghost,
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

const port = process.env.PORT || 3000;

app.use(routes);
app.on('Pronto.', () => {
    app.listen(port, () => {
        console.log(`Acessar em https://${process.env.host}:3000/`);
        console.log('Servidor rodando na porta 3000');
    });
});
