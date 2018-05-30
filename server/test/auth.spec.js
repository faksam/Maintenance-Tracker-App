import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

import users from './mock-data/user.json';

chai.use(chaiHttp);

describe('API endpoint /auth/signin & /auth/signup', () => {
  before(() => {

  });

  after(() => {

  });

  /**
   * @description - POST - Signup Existing User
   */
  it('should not signup existing user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(users.user[0])
      .then((res) => {
        expect(res).to.have.status(409);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.equal('This email/user already exist in our server, try signing in.');
        done();
      });
  });

  /**
   * @description - POST - Signup User
   */
  it('should add new user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(users.user[6])
      .then((res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.data.Fullname).to.equal(users.user[6].fullName);
        expect(res.body.data.Email).to.equal(users.user[6].email);
        expect(res.body.data.Phone).to.equal(users.user[6].phoneNo);
        done();
      });
  });

  /**
   * @description - POST - Signup User
   */
  it('should return 400 Bad Request', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(users.user[2])
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message.fullName).to.equal('Full Name is required, must be between 3-40 characters');
        done();
      });
  });

  /**
   * @description - POST - Signup User
   */
  it('should return 400 Bad Request', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(users.user[3])
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message.email).to.equal('Email does not appear to be valid');
        done();
      });
  });

  /**
   * @description - POST - Signup User
   */
  it('should return 400 Bad Request', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(users.user[4])
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message.phoneNo).to.equal('Phone No is required, must be between 7-15 characters');
        done();
      });
  });

  /**
   * @description - POST - Login User
   */
  it('should return 400 Bad Request', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(users.user[5])
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message.password).to.equal('Password is required, must be between 8-20 characters');
        done();
      });
  });

  /**
   * @description - POST - Login User
   */
  it('should return 400 Bad Request', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(users.user[3])
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message.email).to.equal('Email does not appear to be valid');
        done();
      });
  });

  /**
   * @description - POST - Login User
   */
  it('should return 400 Bad Request', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(users.user[5])
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message.password).to.equal('Password is required');
        done();
      });
  });

  /**
   * @description - POST - Login User
   */
  it('should login user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(users.user[6])
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data.Fullname).to.equal(users.user[6].fullName);
        expect(res.body.data.Email).to.equal(users.user[6].email);
        expect(res.body.data.Phone).to.equal(users.user[6].phoneNo);
        done();
      });
  });

  /**
   * @description - POST - Login none Existing User
   */
  it('should not login none existing user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(users.user[8])
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.equal('User account does not exist.');
        done();
      });
  });
});
