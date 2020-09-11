const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');
const cheerio = require('cheerio');


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

    const routePathAbout = `/about`;
    describe(`GET "${routePathAbout}"`, () => {
      it('should render "about" UI', async () => {
        const apiUrl = routePathAbout;
        const res = await request(server).get(apiUrl);
  
        expect(res.statusCode).toEqual(200);
  
        const $ = cheerio.load(res.text);
        expect($("title").text()).toBe('About');
      });
    });
});