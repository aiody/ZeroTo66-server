const express = require('express');
const userRouter = require('./routes/user');
const recordRouter = require('./routes/record');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin:
      'http://zeroto66-codestates.s3-website.ap-northeast-2.amazonaws.com',
    // 'http://localhost:3000',
    method: ['GET', 'POST'],
    credentials: true,
  })
);

//app.get('/', cors(corsCheck), (req, res) => {
app.get('/', (req, res) => {
  res.send('Hello Express');
});
app.use('/user', userRouter);
app.use('/record', recordRouter);

app.listen(port, () => {
  console.log('server on 4000');
});

// function corsCheck(req, callback) {
//   let corsOptions;
//   const acceptList = [
//     'http://54.180.103.96:4000',
//     'http://localhost:4000',
//     'http://zeroto66-codestates.s3-website.ap-northeast-2.amazonaws.com',
//   ];
//   if (acceptList.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true };
//   } else {
//     corsOptions = { origin: false };
//   }
//   callback(null, corsOptions);
// }
