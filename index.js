const express = require('express');
const userRouter = require('./routes/user');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(
  cors({
    origin: ['http://54.180.103.96:4000/'],
    method: ['GET', 'POST'],
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.send('Hello Express');
});
app.use('/user', userRouter);

app.listen(port, () => {
  console.log('server on 4000');
});
