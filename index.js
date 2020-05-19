const express = require('express');

const app = express();
const port = 4000;

app.get('/', (req, res) => {
  res.send('Hello Express');
});

app.listen(port, () => {
  console.log('server on 4000');
});
