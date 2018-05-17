module.exports = (app) => {
  app.get('/', (req, res, next) => {
    res.status(200).send('Welcome to api/v1');
  });
};
