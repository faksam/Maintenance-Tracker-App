import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

import users from './mock-data/user.json';
import request from './mock-data/usersRequest.json';

let userToken;
chai.use(chaiHttp);

describe('API endpoint /users/requests', () => {
  /**
   * @description - Login A User
   */
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(users.user[7])
      .end((err, res) => {
        userToken = res.body.token;
        done();
      });
  });

  /**
   * @description - GET List all Users requests
   */
  it('should return all /users/requests', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests')
      .set('authorization', `Bearer ${userToken}`)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data[0].title).to.equal('Broken Desk');
        expect(res.body.data[0].description).to.equal('One of the desks in my office is broken. When will it be fixed and repaired. It is very important.');
        done();
      });
  });

  /**
   * @description - GET List users requests by page
   */
  it('should return all /requests?page=1', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests?page=1')
      .set('authorization', `Bearer ${userToken}`)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data[0].title).to.equal('Office Chairs Are All squeaky');
        expect(res.body.data[0].description).to.equal('All the Office Chairs Are squeaky in my office and one is broken. When will it be fixed and repaired. It is very important.');
        done();
      });
  });


  /**
   * @description - GET List all users requests by invalid page number
   */
  it('should return all /requests?page=Lifeisarace', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests?page=Lifeisarace')
      .set('authorization', `Bearer ${userToken}`)
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.equal('Invalid Page Query');
        done();
      });
  });


  /**
   * @description - GET List all requests with invalid token
   */
  it('should not get request if authorization is missing', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests')
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.equal('Token not valid');
        done();
      });
  });

  /**
   * @description - GET List all requests with invalid token
   */
  it('should not get request if token is invalid', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests')
      .set('authorization', 'Bearer ')
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.equal('Token not valid');
        done();
      });
  });

  /**
   * @description - GET none existing request
   */
  it('should return error Not found', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests/100')
      .set('authorization', `Bearer ${userToken}`)
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.equal('Request with id - 100 does not exist for current user');
        done();
      });
  });

  /**
   * @description - GET existing request
   */
  it('should return request with id 5', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests/5')
      .set('authorization', `Bearer ${userToken}`)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data[0].title).to.equal('Office Chairs Are All squeaky');
        expect(res.body.data[0].description).to.equal('All the Office Chairs Are squeaky in my office and one is broken. When will it be fixed and repaired. It is very important.');
        done();
      });
  });

  /**
   * @description - GET existing request
   */
  it('should return an error when request does not belong to user', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests/3')
      .set('authorization', `Bearer ${userToken}`)
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.equal('Request with id - 3 does not exist for current user');
        done();
      });
  });


  /**
   * @description - GET none existing request or path
   */
  it('should not get a request when id is not a number', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests/lifeisarace')
      .set('authorization', `Bearer ${userToken}`)
      .then((res) => {
        expect(res.body.error.message).to.equal('Not Found');
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  /**
   * @description - POST  Add new request
   */
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

  /**
   * @description - POST  Should not create duplicate request
   */
  it('should not create duplicate request', (done) => {
    chai.request(app)
      .post('/api/v1/users/requests')
      .set('authorization', `Bearer ${userToken}`)
      .send(request[0])
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.equal('Request already exist in database. You cannot create a duplicate request.');
        done();
      });
  });

  /**
   * @description - POST  Add new request with incomplete input
   */
  it('should return 400 Bad Request', (done) => {
    chai.request(app)
      .post('/api/v1/users/requests')
      .set('authorization', `Bearer ${userToken}`)
      .send(request[1])
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message.title).to.equal('Title is required, must be between 10-50 characters');
        done();
      });
  });

  /**
   * @description - POST  Add new request with incomplete input
   */
  it('should return 400 Bad Request', (done) => {
    chai.request(app)
      .post('/api/v1/users/requests')
      .set('authorization', `Bearer ${userToken}`)
      .send(request[2])
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message.description).to.equal('Description is required, must be between 20-500 characters');
        done();
      });
  });

  /**
   * @description - PUT  Update specific request/3 by id
   */
  it('should update request/4', (done) => {
    chai.request(app)
      .put('/api/v1/users/requests/4')
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

  /**
   * @description - PUT  Update none esxisting request/100 by id
   */
  it('should return 404 not found error request/100', (done) => {
    chai.request(app)
      .put('/api/v1/users/requests/100')
      .set('authorization', `Bearer ${userToken}`)
      .send(request[0])
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.equal('Request with id - 100 does not exist for current user');
        done();
      });
  });

  /**
   * @description - GET  List all requests
   */
  it('should return all /requests', (done) => {
    chai.request(app)
      .get('/api/v1/requests')
      .set('authorization', `Bearer ${userToken}`)
      .then((res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.equal('You are Forbidden.');
        done();
      });
  });
});

