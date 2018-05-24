import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

import users from './mock-data/user.json';

let userToken;
chai.use(chaiHttp);

describe('API endpoint /users/requests', () => {
  // Login A User
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(users.user[0])
      .end((err, res) => {
        userToken = res.body.token;
        done();
      });
  });

  // GET  List all requests
  it('should return all /users/requests', (done) => {
    chai.request(app)
      .get('/api/v1/requests')
      .set('authorization', `Bearer ${userToken}`)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  // PUT Approve specific request/3 by id
  it('should approve request/3', (done) => {
    chai.request(app)
      .put('/api/v1/requests/3/approve')
      .set('authorization', `Bearer ${userToken}`)
      .send({ status: 'Approved' })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  // PUT Disapprove specific request/3 by id
  it('should disapprove request/2', (done) => {
    chai.request(app)
      .put('/api/v1/requests/2/disapprove')
      .set('authorization', `Bearer ${userToken}`)
      .send({ status: 'Disapproved' })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  // PUT Resolve specific request/3 by id
  it('should resolve request/1', (done) => {
    chai.request(app)
      .put('/api/v1/requests/1/resolve')
      .set('authorization', `Bearer ${userToken}`)
      .send({ status: 'Resolved' })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
