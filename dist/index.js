import express from 'express';
import * as path from 'path';
const app = express();
app.use('/', express.static(path.join(import.meta.dirname, '../site'), { extensions: ['html'] }));
app.get('/sock.js', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'sock.js'));
});
app.get('/sock.js.map', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'sock.js.map'));
});
app.get('/emulator-demo.js', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'emulator-demo.js'));
});
app.get('/emulator-demo.js.map', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'emulator-demo.js.map'));
});
app.listen(3001, () => {
    console.log("Listening on port 3001");
});
//# sourceMappingURL=index.js.map