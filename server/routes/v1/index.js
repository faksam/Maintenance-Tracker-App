export default (app) => {
  app.get('/', (req, res) => {
    res.status(200).send('Welcome to api/v1');
    res.redirect('https://maintenancetracker.docs.apiary.io/');
  });
};
