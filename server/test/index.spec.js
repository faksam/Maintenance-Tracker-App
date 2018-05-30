import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);

describe('API endpoint /api/v1/', () => {
  /**
   * @description - GET - home page
   */
  it('get the home page status', (done) => {
    chai.request(app)
      .get('/api/v1/')
      .then((res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  /**
   * @description - GET - Invalid path
   */
  it('should return Not Found', (done) => {
    chai.request(app)
      .get('/INVALID_PATH')
      .then((res) => {
        expect(res.statusCode).to.equal(404);
        done();
      });
  });
});

