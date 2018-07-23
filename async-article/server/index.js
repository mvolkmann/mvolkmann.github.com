const express = require('express');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

function random(max = 100, min = 0) {
  min = Number(min);
  max = Number(max);
  const rand = min + Math.floor(Math.random() * (max + 1 - min));
  return rand;
}

app.get('/random', (req, res) => {
  const {min, max} = req.query;
  const rand = random(min, max);
  res.send(String(rand));
});

app.get('/random-point', (req, res) => {
  const {max} = req.query;
  const x = random(max);
  const y = random(max);
  res.send([x, y]);
});

const PORT = 3002;
app.listen(PORT, () => console.log('listening on', PORT));
