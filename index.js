const express = require('express');
const userRouter = require('./routes/user');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(
  cors({
    method: ['GET', 'POST'],
    credentials: true,
  })
);

app.get('/', cors(corsCheck), (req, res) => {
  res.send('Hello Express');
});
app.use('/user', userRouter);

app.listen(port, () => {
  console.log('server on 4000');
});

function corsCheck(req, callback) {
  let corsOptions;
  const acceptList = [
    'http://54.180.103.96:4000',
    'http://localhost:4000',
    'http://zeroto66-codestates.s3-website.ap-northeast-2.amazonaws.com/',
  ];
  if (acceptList.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
}
