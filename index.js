const express = require('express');
const userRouter = require('./routes/user');
const bodyParser = require('body-parser');

const app = express();
const port = 4000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello Express');
});
app.use('/user', userRouter);

app.listen(port, () => {
  console.log('server on 4000');
});
