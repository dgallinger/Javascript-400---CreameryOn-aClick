const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');


describe("/about", () => {
    beforeAll(testUtils.connectDB);
    afterAll(testUtils.stopDB);
    afterEach(testUtils.clearDB);
    describe('GET /', () => {
        it('should send 200 on getting about page', async () => {
          const res = await request(server).get("/about");
          expect(res.statusCode).toEqual(200);
        });
    });
});