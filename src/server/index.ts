import express, { type Express, type Application } from 'express';
import * as path from 'path';

const app: Express = express();

app.use('/', express.static(path.join(import.meta.dirname, '../../public'), { extensions: ['html'] }));

app.get('/sock.js', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, '../client/sock.js'));
});
app.get('/sock.js.map', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, '../client/sock.js.map'));
});

app.get('/emulator-demo.js', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, '../client/emulator-demo.js'));
});
app.get('/emulator-demo.js.map', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, '../client/emulator-demo.js.map'));
});

app.listen(3001, () => {
    console.log("Listening on port 3001");
});