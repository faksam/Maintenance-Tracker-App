import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

import users from './mock-data/user.json';

let userToken;
chai.use(chaiHttp);

describe('API endpoint login user', () => {
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
  it('should return all /requests', (done) => {
    chai.request(app)
      .get('/api/v1/requests')
      .set('authorization', `Bearer ${userToken}`)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data[0].title).to.equal('Broken Desk');
        expect(res.body.data[0].description).to.equal('One of the desks in my office is broken. When will it be fixed and repaired. It is very important.');
        done();
      });
  });

  // PUT Approve specific request/3 by id
  it('should approve request/3', (done) => {
    chai.request(app)
      .put('/api/v1/requests/3/approve')
      .set('authorization', `Bearer ${userToken}`)
      .send({ status: 'Pending' })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data[0].status).to.equal('Pending');
        expect(res.body.data[0].title).to.equal('Laptop Over-Heating');
        done();
      });
  });

  // approve a requests with invalid token
  it('should not get request if headers.authorization is missing', (done) => {
    chai.request(app)
      .put('/api/v1/requests/3/approve')
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.equal('Token not valid');
        done();
      });
  });


  // PUT Approve specific request/3 by id
  it('should not approve request if token is invalid', (done) => {
    chai.request(app)
      .put('/api/v1/requests/3/approve')
      .set('authorization', 'Bearer ')
      .send({ status: 'Approved' })
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.equal('Token not valid');
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
        expect(res.body.data[0].status).to.equal('Disapproved');
        expect(res.body.data[0].title).to.equal('Broken Monitor');
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
        expect(res.body.data[0].status).to.equal('Resolved');
        expect(res.body.data[0].title).to.equal('Broken Desk');
        done();
      });
  });
});
