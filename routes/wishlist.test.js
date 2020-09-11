const User = require('../models/users');
const Item = require('../models/items');
const Wishlist = require('../models/wishlist');
const wishlistDAO = require('../daos/wishlist');

const server = require("../server");
const testUtils = require('../test-utils');
const request = require("supertest");
require("jest");
const testBase = require('../test-base');


jest.mock('./middleware');
const { isLoggedIn } = require('./middleware');


describe('Wishlist routes within wishlist.js and user.js', () => {
  const routePathGetProfileWishlist = `/user/profile/wishlists`;
  const routePathUpdateProfileWishlist = `/user/profile/wishlists/update/:id`;
  const routePathDeleteProfileWishlist = `/user/profile/wishlists/:id`;

  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

 
  describe('positive tests', () => 
  {
    describe(`GET "${routePathGetProfileWishlist}"`, () => {
      it('should successfully get all wishlists data', async () => {
        testBase.setupTemplateOutputAsJson();
        const createdMockUser = await User.create(testBase.mockUsers[0]);
        const createdMockItem1 = await Item.create(testBase.mockItems[0]);
        const createdMockItem2 = await Item.create(testBase.mockItems[1]);
        const mockWishList1 = {
          userId: createdMockUser._id,
          items: [{itemId: createdMockItem1._id}],
          name: 'test-wishlist-1',
        };
        await Wishlist.create(mockWishList1);
        const mockWishList2 = {
          userId: createdMockUser._id,
          items: [{itemId: createdMockItem2._id}],
          name: 'test-wishlist-2',
        };
        await Wishlist.create(mockWishList2);

        const mockIsLoggedInAsUser = async (req, res, next) => {
          req.flash = (status, message) => [status, message];
          req.isAuthenticated = () => true;
          req.user = { id: createdMockUser._id };
          next();
        };
        isLoggedIn.mockImplementation(mockIsLoggedInAsUser);
        
        const apiUrl = routePathGetProfileWishlist;
        const res = await request(server).get(apiUrl).send();

        expect(res.statusCode).toEqual(200); 
        const resWishlists = JSON.parse(res.text).wishlists;
        expect(resWishlists.length).toEqual(2);

        const retrievedWishlists = await wishlistDAO.getAllByUserId(createdMockUser._id);       
        expect(resWishlists).toMatchObject(JSON.parse(JSON.stringify(retrievedWishlists)));
      });
    });

    describe(`UPDATE "${routePathUpdateProfileWishlist}"`, () => {
      it('should redirect to wishlists UI, upon successful wishlist update', async () => {
        testBase.setupTemplateOutputAsJson();
        isLoggedIn.mockImplementation(testBase.mockIsLoggedInAsUser);
        const createdMockUser = await User.create(testBase.mockUsers[0]);
        const createdMockItem1 = await Item.create(testBase.mockItems[0]);
        const mockWishList1 = {
          userId: createdMockUser._id,
          items: [{itemId: createdMockItem1._id}],
          name: 'test-wishlist',
        };
        const createdMockWishList = await Wishlist.create(mockWishList1);
        const { _id } = createdMockWishList;
           
        const nameToUpdate = 'test-wishlist-updated';
        const apiUrl = routePathUpdateProfileWishlist.replace(":id", _id);
        const res = await request(server).post(apiUrl).send({name: nameToUpdate});

        const redirectLocation = `/user/profile/wishlists`;
        expect(res.statusCode).toEqual(302);
        expect(res.headers.location).toEqual(redirectLocation);

        const retrievedMockWishlist = await Wishlist.findById(_id).lean();
        expect(retrievedMockWishlist.name).toEqual(nameToUpdate);
      });
    });

    describe(`DELETE "${routePathDeleteProfileWishlist}"`, () => {
      it('should redirect to user profile UI, upon successful wishlist deletion', async () => {
        isLoggedIn.mockImplementation(testBase.mockIsLoggedInAsUser);
        const createdMockUser = await User.create(testBase.mockUsers[0]);
        const createdMockItem1 = await Item.create(testBase.mockItems[0]);
        const mockWishList1 = {
          userId: createdMockUser._id,
          items: [{itemId: createdMockItem1._id}],
          name: 'test-wishlist',
        };
        const createdMockWishList = await Wishlist.create(mockWishList1);
        const { _id } = createdMockWishList;
        const beforeCount = await Wishlist.count();
        expect(beforeCount).toEqual(1);

        const apiUrl = routePathDeleteProfileWishlist.replace(":id", _id);
        const res = await request(server).get(apiUrl).send();

        const redirectLocation = `/user/profile`;
        expect(res.statusCode).toEqual(302);
        expect(res.headers.location).toEqual(redirectLocation);

        const afterCount = await Wishlist.count();
        expect(afterCount).toEqual(0);     
      });
    });

  });
});