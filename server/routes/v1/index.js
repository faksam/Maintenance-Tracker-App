export default (app) => {
  app.get('/', (req, res) => {
    res.redirect('https://maintenancetracker.docs.apiary.io/');
  });
};
