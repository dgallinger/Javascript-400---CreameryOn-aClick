const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');
const cheerio = require('cheerio');


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

    const routePathContact = `/contact`;
    describe(`GET "${routePathContact}"`, () => {
      it('should render "contact" UI', async () => {
        const apiUrl = routePathContact;
        const res = await request(server).get(apiUrl);
  
        expect(res.statusCode).toEqual(200);
  
        const $ = cheerio.load(res.text);
        expect($("h3").text()).toBe('Contact us');
      });
    });
});