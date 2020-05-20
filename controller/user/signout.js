module.exports = {
  get: (req, res) => {
    res.cookie('token', '').status(200).send('succeed logout');
  },
};
