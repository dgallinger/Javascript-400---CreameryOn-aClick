  
const request = require("supertest");
const server = require("../server");
const testUtils = require('../test-utils');
const express = require('express');
const passport = require('../config/passport');

const User = require('../models/users');
const Wishlist = require('../models/wishlist');
const Orders = require('../models/order');
const Item = require('../models/items');


describe('Login', () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);
  afterEach(testUtils.clearDB);

  let cookie;
  const user0 = {
    email: 'user0@mail.com',
    password: '123password'
  };
  const user1 = {
    email: 'user1@mail.com',
    password: '456password',
    roles: ['admin']
  }

  describe('Before signup', () => {
    describe('POST /user/signin', () => {
      it('should rediredt to signin', async () => {
        const res = await request(server).post('/user/signin').send(user0);
        expect(res.statusCode).toEqual(302);
        expect(res.header.location).toEqual('/user/signin');
      });
    });
    describe('GET /logout', () => {
      it("should redirect to '/'", async () => {
        const res = await request(server).get('/user/logout');
        expect(res.statusCode).toEqual(302);
        expect(res.header.location).toEqual('/');
      });
    });
  });
  describe('Signup', () => {
    it('should fail with incorrect credentials and return to signup', async () => {
      const res = await request(server).post('/user/signup').send({ email: 'bob', password: 'demo123' });
      expect(res.statusCode).toEqual(302);
      expect(res.header.location).toEqual('/user/signup');
    });
    it('should succeed with correct credentials and go to profile', async () => {
      const res = await request(server).post('/user/signup').send(user0);
      expect(res.statusCode).toEqual(302);
      expect(res.header.location).toEqual('/');
    });
    it('should not allow duplicate email to signup', async () => {
      await request(server).post('/user/signup').send(user0);
      const res = await request(server).post('/user/signup').send(user0);
      expect(res.statusCode).toEqual(302);
      expect(res.header.location).toEqual('/user/signup');

    });
  });
  describe('Logout', () => {
    it('should logout successfully', async () => {
      const res = await request(server).get('/user/logout');
      expect(res.statusCode).toEqual(302);
      expect(res.header.location).toEqual('/');
    });
  });

  describe("User after signup", () => {
    beforeEach(async () => {
      await request(server).post("/user/signup").send(user0);
      await request(server).post("/user/signup").send(user1);
    });
  describe('Sign in', () => {
    it('valid user should signin and redirect to homepage', async () => {
      const res = await request(server).post('/user/signin').send(user0);
      expect(res.statusCode).toEqual(302);
      expect(res.header.location).toEqual('/');  
    });
    it('should fail and redirect to signin page with invalid user', async () => {
      const res = await request(server).post('/user/signin').send({ email : 'invalid', password : 'invalid' });
      expect(res.statusCode).toEqual(302);
      expect(res.header.location).toEqual('/user/signin'); 
    });
    it('should redirect to admin page with admin user login', async () => {
      await User.updateOne({ email : user1.email }, { $push : { roles : { $each : ['admin'], $position : 0 }}});
      const res = await request(server).post('/user/signin').send(user1);
      expect(res.statusCode).toEqual(302);
      expect(res.header.location).toEqual('/admin');
    });
    it('should allow valid user to change password', async () => {
      const thisUser = {
        user : {email: 'user0@mail.com', password : '123password'},
        password: '456password'
      };
     const res = await request(server).post('/user/change-password').send(thisUser);
      expect(res.statusCode).toEqual(302);
      expect(res.header.location).toEqual('/');
    });
    it('should not change password for invalid user', async () => {
      const badUser = {
        user : { email : 'not@mail.com', password : 'doesnt matter' },
        password : 'password999'
      };
      const res = await request(server).post('/user/change-password').send(badUser);
      expect(res.statusCode).toEqual(302);
      expect(res.header.location).toEqual('/user/change-password');
    });
    it('should return status 200', async () => {
      const res0 = await request(server).post("/user/signin").send(user0)
        .then((res) => { cookie = res.header['set-cookie'] });
      const res = await request(server).get('/user/profile').set('Cookie', cookie);
      expect(res.statusCode).toEqual(200);
    });
  });
  });
  describe('Wishlist', () => {
    let wishlist;
    let userId;
    describe('Before login', () => {
      it('should redirect to home page', async () => {
        const res = await request(server).get('/user/profile/wishlists').send(user0);
        expect(res.statusCode).toEqual(302);
        expect(res.header.location).toEqual('/');
      });
      it('should do redorect to home page with a bad token', async () => {
        const res = await request(server).get('/user/profile/wishlists')
          .set('Cookie', 'bad cookie');
        expect(res.statusCode).toEqual(302);
        expect(res.header.location).toEqual('/');
      });
    });
    describe('After login', () => {
      beforeEach(async () => {
        //create an item
        const item = await Item.create({
          imagePath: 'test URL',
          title: 'chocolate',
          description: 'chocolate',
          story:  'story',
          size: 'small',
          price: 5
        });
        //signup/signin user
        const res0 = await request(server).post('/user/signup').send(user0);
        await request(server).post('/user/signin').send(user0)
          .then((res) => { cookie = res.header['set-cookie'] });

        const wishlistDetails = {
          userId : res0._id,
          items : item,
          name : 'my wishlist'
        };
        //create a wishlist
       //wishlist = await Wishlist.create(wishlistDetails);
      });
      describe('GET Wishlist', () => {
        it('should return wishlist for valid user', async () => {
          //console.log(wishlist);
        });
      });
    }); 
  });
});
