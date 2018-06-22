import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

import users from './mock-data/user.json';

let userToken;
chai.use(chaiHttp);

describe('API endpoint /users/account', () => {
  /**
   * @description - POST - Signup User
   */
  it('should add new user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(users.user[11])
      .then((res) => {
        userToken = res.body.token;
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.data.fullName).to.equal(users.user[11].fullName);
        expect(res.body.data.email).to.equal(users.user[11].email);
        done();
      });
  });

  /**
   * @description - GET Users Account Details
   */
  it('should return users acccount details', (done) => {
    chai.request(app)
      .get('/api/v1/users/account')
      .set('authorization', `Bearer ${userToken}`)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        expect(res.body.data.fullName).to.equal(users.user[11].fullName);
        expect(res.body.data.email).to.equal(users.user[11].email);
        done();
      });
  });

  /**
   * @description - PUT - Update User Details
   */
  it('should update user account detail', (done) => {
    chai.request(app)
      .put('/api/v1/users/account')
      .set('authorization', `Bearer ${userToken}`)
      .send(users.user[12])
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data.fullName).to.equal(users.user[12].fullName);
        expect(res.body.data.email).to.equal(users.user[12].email);
        done();
      });
  });

  /**
   * @description - PUT - Update User Details
   */
  it('should update user account detail', (done) => {
    chai.request(app)
      .put('/api/v1/users/account')
      .set('authorization', `Bearer ${userToken}`)
      .send(users.user[3])
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message.email).to.equal('Email must be a valid email');
        done();
      });
  });

  /**
   * @description - PUT - Update User Details
   */
  it('should update user account detail', (done) => {
    chai.request(app)
      .put('/api/v1/users/account')
      .set('authorization', `Bearer ${userToken}`)
      .send(users.user[2])
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message.fullName).to.equal('Full Name must be between 3-40 characters');
        done();
      });
  });

  /**
   * @description - PUT - Update User Account Password without new password
   */
  it('should return error requesting all password inputs', (done) => {
    chai.request(app)
      .put('/api/v1/users/account/password')
      .set('authorization', `Bearer ${userToken}`)
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message.password).to.equal('Current Password usually between 8-20 characters');
        expect(res.body.error.message.newPassword).to.equal('New Password Input & Confirm New Password must be equal between 8-20 characters');
        expect(res.body.error.message.confirmNewPassword).to.equal('Confirm New Password must be between 8-20 characters');
        done();
      });
  });

  /**
   * @description - PUT - Update User Account Password with none matching password
   */
  it('should return error requesting matching new & confirm password inputs', (done) => {
    chai.request(app)
      .put('/api/v1/users/account/password')
      .send({
        password: 'Lifeisarace',
        newPassword: 'Lifeisarace2',
        confirmNewPassword: 'Lifeisarace',
      })
      .set('authorization', `Bearer ${userToken}`)
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message.newPassword).to.equal('New Password Input & Confirm New Password must be equal between 8-20 characters');
        done();
      });
  });

  /**
   * @description - PUT - Update User Account Password with invalid current password
   */
  it('should return error requesting correct current password inputs', (done) => {
    chai.request(app)
      .put('/api/v1/users/account/password')
      .send({
        password: 'LifeisaraceJump',
        newPassword: 'Lifeisarace2',
        confirmNewPassword: 'Lifeisarace2',
      })
      .set('authorization', `Bearer ${userToken}`)
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.error.message).to.equal('Current Password is Invalid');
        done();
      });
  });

  /**
   * @description - PUT - Update User Account Password without new password
   */
  it('should update user password', (done) => {
    chai.request(app)
      .put('/api/v1/users/account/password')
      .send({
        password: 'Lifeisarace',
        newPassword: 'Lifeisarace2',
        confirmNewPassword: 'Lifeisarace2',
      })
      .set('authorization', `Bearer ${userToken}`)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data.fullName).to.equal(users.user[12].fullName);
        expect(res.body.data.email).to.equal(users.user[12].email);
        done();
      });
  });
});

