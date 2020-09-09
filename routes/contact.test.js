const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');


describe("/contact", () => {
    beforeAll(testUtils.connectDB);
    afterAll(testUtils.stopDB);
    afterEach(testUtils.clearDB);
    describe('GET /', () => {
        it('should send 200 on getting connect page', async () => {
          const res = await request(server).get("/contact");
          expect(res.statusCode).toEqual(200);
        });
    });
});