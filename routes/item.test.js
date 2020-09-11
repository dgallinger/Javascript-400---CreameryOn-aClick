const server = require("../server");
const testUtils = require('../test-utils');
const request = require("supertest");
require("jest");
const testBase = require('../test-base');


jest.mock('./middleware');
const { isPublic } = require('./middleware');
// Found a seemingly better approach - keeping old code for reference
/*
const mockMiddleware = () => jest.mock('./middleware', () => ({
  isPublic: jest.fn(async ( req, res, next) => {
    req.flash = status => [status];
    next();
  }),
  isLoggedIn: jest.fn(),
  notLoggedIn: jest.fn(),
  isAdmin: jest.fn(),
}));
*/


describe('item.js', () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  describe('GET "/"', () => {
    it('should successfully get all items data', async () => {
      testBase.setupTemplateOutputAsJson();
      isPublic.mockImplementation(testBase.mockIsPublic);
      const mockItems = await testBase.createMockItems(testBase.mockItems);

      const apiUrl = "/";
      const res = await request(server).get(apiUrl).send();

      expect(res.statusCode).toEqual(200); 
      const resItemCols = JSON.parse(res.text).items;
      let resItems = [];
      for (let i = 0; i < resItemCols.length; i++) {
        resItems.push(...resItemCols[i]);
      }
      expect(resItems.length).toEqual(4);
      expect(resItems).toMatchObject(mockItems);
    });
  });

  describe('middleware error handling', () => {
    it('should handle unexpected errors', async () => {
      isPublic.mockImplementation(async (req, res, next) => {
        try {
          throw new Error('stack trace');
        } catch(err) {
          next(err);
        }
      });

      const apiUrl = "/";
      const res = await request(server).get(apiUrl).send();

      expect(res.statusCode).toEqual(500);
      expect(res.text).toEqual('An unexpected error occurred.');
    });
  });

});