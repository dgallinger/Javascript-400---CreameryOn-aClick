const server = require("../server");
const testUtils = require('../test-utils');
const request = require("supertest");
const middleware = require("./middleware");
require("jest");
const testBase = require('../test-base');


describe('middleware.js', () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  describe('negative tests', () => 
  {
    describe('middleware isLoggedIn', () => {
      it('should NOT allow unauthenticated user to access route, and redirect to landing UI', async () => {
        const routePath = "/mock/route/isNotAuthenticated";
        const mockReq = jest.fn(async (req, res, next) => {
          req.isAuthenticated = () => false;
          next();
        });
        server.get(routePath, 
          mockReq, 
          middleware.isLoggedIn, 
          async (req, res, next) => { res.json('test passed'); }
        );

        const res = await request(server).get(routePath).send();

        const redirectLocation = `/`;
        expect(res.statusCode).toEqual(302);
        expect(res.headers.location).toEqual(redirectLocation);
      });
    });

    describe('middleware isAdmin', () => {
      it('should NOT allow unauthorized user to access route, and return forbidden', async () => {
        const routePath = "/mock/route/isNotAuthorized";
        const mockReq = jest.fn(async (req, res, next) => {
          req.isAuthenticated = () => true;
          req.user = { roles: [], };
          next();
        });
        server.get(routePath, 
          mockReq, 
          middleware.isLoggedIn,
          middleware.isAdmin, 
          async (req, res, next) => { res.json('test passed'); }
        );

        const res = await request(server).get(routePath).send();

        expect(res.statusCode).toEqual(403);
      });
    });

  });



  describe('positive tests', () => 
  {
    describe('middleware isPublic', () => {
      it('should allow public access to route', async () => {
        const routePath = "/mock/route/public";
        server.get(routePath, middleware.isPublic, async (req, res, next) => {
          res.json('test passed');
        });

        const res = await request(server).get(routePath).send();

        expect(res.statusCode).toEqual(200); 
        expect(res.body).toEqual('test passed');
      });
    });

    describe('middleware isLoggedIn', () => {
      it('should allow authenticated user to access route', async () => {
        const routePath = "/mock/route/isAuthenticated";
        const mockReq = jest.fn(async (req, res, next) => {
          //console.log('called mockReq');
          req.isAuthenticated = () => true;
          next();
        });
        server.get(routePath, 
          mockReq, 
          middleware.isLoggedIn, 
          async (req, res, next) => { res.json('test passed'); }
        );

        const res = await request(server).get(routePath).send();

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual('test passed');
      });
    });

    describe('middleware isAdmin', () => {
      it('should allow authorized Admin user to access route', async () => {
        const routePath = "/mock/route/isAuthorized";
        const mockReq = jest.fn(async (req, res, next) => {
          req.isAuthenticated = () => true;
          req.user = { roles: ['admin'], };
          next();
        });
        server.get(routePath, 
          mockReq, 
          middleware.isLoggedIn,
          middleware.isAdmin, 
          async (req, res, next) => { res.json('test passed'); }
        );

        const res = await request(server).get(routePath).send();

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual('test passed');
      });
    });

  });
});