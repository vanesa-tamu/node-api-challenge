const express = require('express');

const server = express();

server.use(express.json());

const Porject = require('./ProjectRouter.js')
const Action = require('./ActionRouter.js')

server.use('/api/projects', Porject)
server.use('/api/actions', Action)

server.get('/', (req, res) => {
    res.send(`
      <h2>Lambda Sprint:)</h>
      <p>... </p>
    `);
});

module.exports = server;