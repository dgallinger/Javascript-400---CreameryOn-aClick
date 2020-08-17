const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

const Mock = require('../models/mock');

describe("/mocks", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  describe('POST /mocks', () => {
    it('should send 200 and store mock item', async() => {
      const res = await request(server).post("/mocks");
      expect(res.statusCode).toEqual(200);   
      expect(await Mock.count()).toEqual(1);
    });
  });

  describe('GET /mocks', () => {
    it('should send 200 and return items after post', async() => {
      await request(server).post("/mocks");
      await request(server).post("/mocks");

      const res = await request(server).get("/mocks");
      expect(res.statusCode).toEqual(200);   
      expect(await Mock.count()).toEqual(2);
    });
  });

});