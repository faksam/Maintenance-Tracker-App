import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

import users from './mock-data/user.json';
import request from './mock-data/usersRequest.json';

let userToken;
chai.use(chaiHttp);

describe('API endpoint /users/requests', () => {
  // Login A User
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(users.user[7])
      .end((err, res) => {
        userToken = res.body.token;
        done();
      });
  });

  // GET  List all requests
  it('should return all /users/requests', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests')
      .set('authorization', `Bearer ${userToken}`)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  // GET none existing request
  it('should return error Not found', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests/100')
      .set('authorization', `Bearer ${userToken}`)
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.equal('request id not found');
        done();
      });
  });

  // GET existing request
  it('should return request with id 3', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests/3')
      .set('authorization', `Bearer ${userToken}`)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  // GET existing request
  it('should not get a request when id is not a number', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests/lifeisarace')
      .set('authorization', `Bearer ${userToken}`)
      .then((res) => {
        expect(res.body.error.message).to.equal('id parameter must be a valid integer number');
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });


  // POST  Add new request
  it('should add new request', (done) => {
    chai.request(app)
      .post('/api/v1/users/requests')
      .set('authorization', `Bearer ${userToken}`)
      .send(request[0])
      .then((res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.data.title).to.equal(request[0].title);
        expect(res.body.data.description).to.equal(request[0].description);
        done();
      });
  });

  // POST  Add new request with incomplete input
  it('should return 400 Bad Request', (done) => {
    chai.request(app)
      .post('/api/v1/users/requests')
      .set('authorization', `Bearer ${userToken}`)
      .send(request[1])
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message.title).to.equal('Title is required');
        done();
      });
  });

  // POST  Add new request with incomplete input
  it('should return 400 Bad Request', (done) => {
    chai.request(app)
      .post('/api/v1/users/requests')
      .set('authorization', `Bearer ${userToken}`)
      .send(request[2])
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message.description).to.equal('Description is required');
        done();
      });
  });

  // PUT  Update specific request/3 by id
  it('should update request/3', (done) => {
    chai.request(app)
      .put('/api/v1/users/requests/3')
      .set('authorization', `Bearer ${userToken}`)
      .send(request[0])
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data.title).to.equal(request[0].title);
        expect(res.body.data.description).to.equal(request[0].description);
        done();
      });
  });

  // PUT  Update none esxisting request/100 by id
  it('should return 404 not found error request/100', (done) => {
    chai.request(app)
      .put('/api/v1/users/requests/100')
      .set('authorization', `Bearer ${userToken}`)
      .send(request[0])
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.equal('request id not found');
        done();
      });
  });
});
