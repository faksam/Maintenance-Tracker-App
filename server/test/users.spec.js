import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

import request from './mock-data/usersRequest.json';

chai.use(chaiHttp);

describe('API endpoint /users/requests', () => {
  // GET  List all requests
  it('it should return all /users/requests', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests')
      .then((res) => {
        expect(res).to.have.status(200);
        // expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        done();
      });
  });

  // GET none existing request
  it('it should return error Not found', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests/100')
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  // GET existing request
  it('it should return request with id 3', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests/3')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  // POST  Add new request
  it('it should add new request', (done) => {
    chai.request(app)
      .post('/api/v1/users/requests')
      .send(request[0])
      .then((res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  // POST  Add new request with incomplete input
  it('it should return 400 Bad Request', (done) => {
    chai.request(app)
      .post('/api/v1/users/requests')
      .send(request[1])
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  // POST  Add new request with incomplete input
  it('it should return 400 Bad Request', (done) => {
    chai.request(app)
      .post('/api/v1/users/requests')
      .send(request[2])
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  // PUT  Update specific request/3 by id
  it('it should update request/3', (done) => {
    chai.request(app)
      .put('/api/v1/users/requests/3')
      .send(request[0])
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
