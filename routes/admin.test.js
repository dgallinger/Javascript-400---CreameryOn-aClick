const User = require('../models/users');
const Item = require('../models/items');
const orderDAO = require('../daos/order');
const Order = require('../models/order');

const server = require("../server");
const testUtils = require('../test-utils');
const request = require("supertest");
require("jest");
const testBase = require('../test-base');


jest.mock('./middleware');
const { isLoggedIn, isAdmin } = require('./middleware');


describe('admin.js', () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  const routePathGetItems = `/admin/items`;
  const routePathUpdateItem = `/admin/items/update/:id`;
  const routePathCreateItem = `/admin/items/add`;
  const routePathDeleteItem = `/admin/items/:id`;
  const routePathGetOrders = `/admin/orders`;
  const routePathUpdateOrder = `/admin/orders/update/:id`;
  const routePathProfileGetOrders = `/user/profile/orders`;
  const routePathProfileGetOrderById = `/user/profile/orders/:id`;

  describe('negative tests: Items', () => 
  {
    describe(`GET "${routePathGetItems}"`, () => {
      it('should redirect to homepage UI upon failed authorization', async () => {
        isLoggedIn.mockImplementation(testBase.mockIsLoggedInFalse);
        const apiUrl = routePathGetItems;
        const res = await request(server).get(apiUrl).send();

        const redirectLocation = `/`;
        expect(res.statusCode).toEqual(302);
        expect(res.headers.location).toEqual(redirectLocation);
      });
    });
  });



  describe('positive tests: Items', () =>
  {
    describe(`GET "${routePathGetItems}"`, () => {
      it('should successfully get all items data', async () => {
        testBase.setupTemplateOutputAsJson();
        isLoggedIn.mockImplementation(testBase.mockIsLoggedInAsAdmin);
        const createdMockItems = await testBase.createMockItems(testBase.mockItems);

        const apiUrl = routePathGetItems;
        const res = await request(server).get(apiUrl).send();

        expect(res.statusCode).toEqual(200); 
        const resItemCols = JSON.parse(res.text).items;
        let resItems = [];
        for (let i = 0; i < resItemCols.length; i++) {
          resItems.push(...resItemCols[i]);
        }
        expect(resItems.length).toEqual(4);
        expect(resItems).toMatchObject(createdMockItems);
      });
    });

    describe(`POST "${routePathUpdateItem}"`, () => {
      it('should redirect to admin items UI, upon successful item update', async () => {
        isLoggedIn.mockImplementation(testBase.mockIsLoggedInAsAdmin);
        isAdmin.mockImplementation(testBase.mockIsAdmin);
        const createdMockItem = await Item.create(testBase.mockItems[0]);
        const{ _id, title } = createdMockItem;
        const updatedTitle = `${title}-updated`;

        const apiUrl = routePathUpdateItem.replace(":id", _id);
        const res = await request(server)
          .post(apiUrl)
          .send({title: updatedTitle});
    
        const redirectLocation = `/admin/items`;
        expect(res.statusCode).toEqual(302);
        expect(res.headers.location).toEqual(redirectLocation);

        const retrievedMockItem = await Item.findById(_id).lean();
        expect(retrievedMockItem.title).toEqual(updatedTitle);
      });
    });

    describe(`POST "${routePathCreateItem}"`, () => {
      it('should redirect to admin items UI, upon successful item creation', async () => {
        isLoggedIn.mockImplementation(testBase.mockIsLoggedInAsAdmin);
        isAdmin.mockImplementation(testBase.mockIsAdmin);
        const mockItem = testBase.mockItems[0];
        
        const apiUrl = routePathCreateItem;
        const res = await request(server).post(apiUrl).send(mockItem);

        const redirectLocation = `/admin/items`;
        expect(res.statusCode).toEqual(302);
        expect(res.headers.location).toEqual(redirectLocation);

        const retrievedMockItem = await Item.find({}, { _id: 0, __v: 0 }).lean();
        expect(retrievedMockItem.length).toEqual(1);
        expect(retrievedMockItem[0]).toMatchObject(mockItem);
      });
    });

    describe(`GET "${routePathDeleteItem}"`, () => {
      it('should redirect to admin items UI, upon successful item deletion', async () => {
        isLoggedIn.mockImplementation(testBase.mockIsLoggedInAsAdmin);
        isAdmin.mockImplementation(testBase.mockIsAdmin);
        const createdMockItem = await Item.create(testBase.mockItems[0]);
        const{ _id } = createdMockItem;
        const beforeCount = await Item.count();
        expect(beforeCount).toEqual(1);

        const apiUrl = routePathDeleteItem.replace(":id", _id);
        const res = await request(server).get(apiUrl).send();

        const redirectLocation = `/admin/items`;
        expect(res.statusCode).toEqual(302);
        expect(res.headers.location).toEqual(redirectLocation);

        const afterCount = await Item.count();
        expect(afterCount).toEqual(0);     
      });
    });

  });



  describe('negative tests: Orders - Admin', () => 
  {
    describe(`GET "${routePathGetOrders}"`, () => {
      it('should redirect to homepage upon failed authorization', async () => {
        isLoggedIn.mockImplementation(testBase.mockIsLoggedInFalse);
        const apiUrl = routePathGetOrders;
        const res = await request(server).get(apiUrl).send();

        const redirectLocation = `/`;
        expect(res.statusCode).toEqual(302);
        expect(res.headers.location).toEqual(redirectLocation);
      });
    });
  });



  describe('positive tests: Orders - Admin', () =>
  {
    describe(`GET "${routePathGetOrders}"`, () => {
      it('should successfully get all orders data for ADMIN', async () => {
        testBase.setupTemplateOutputAsJson();
        isLoggedIn.mockImplementation(testBase.mockIsLoggedInAsAdmin);
        isAdmin.mockImplementation(testBase.mockIsAdmin);
        const createdMockUser = await User.create(testBase.mockUsers[0])
        const createdMockItem1 = await Item.create(testBase.mockItems[0]);
        const createdMockItem2 = await Item.create(testBase.mockItems[1]);

        const quantity = 1;
        await Order.create({
          userId: createdMockUser._id,
          items: [{itemId: createdMockItem1._id, quantity}],
          total: createdMockItem1.price * quantity,
          status: 'New',
          address: 'test-address1',
          recipient: 'test-recipient1'
        });
        await Order.create({
          userId: createdMockUser._id,
          items: [
            {itemId: createdMockItem1._id, quantity},
            {itemId: createdMockItem2._id, quantity}
          ],
          total: createdMockItem1.price * quantity,
          status: 'New',
          address: 'test-address2',
          recipient: 'test-recipient2'
        });
        //await testBase.createMockOrders([mockOrder1, mockOrder2]);

        const apiUrl = routePathGetOrders;
        const res = await request(server).get(apiUrl).send();
        
        expect(res.statusCode).toEqual(200); 
        const resOrders = JSON.parse(res.text).orders;
        expect(resOrders.length).toEqual(2);

        const retrievedOrders = await orderDAO.getAll();
        expect(resOrders).toMatchObject(JSON.parse(JSON.stringify(retrievedOrders)));
      });
    });

    describe(`POST "${routePathUpdateOrder}"`, () => {
      it('should redirect to admin orders UI, upon successful order update', async () => {
        isLoggedIn.mockImplementation(testBase.mockIsLoggedInAsAdmin);
        isAdmin.mockImplementation(testBase.mockIsAdmin);
        const createdMockUser = await User.create(testBase.mockUsers[0])
        const createdMockItem = await Item.create(testBase.mockItems[0]);
        const quantity = 1;
        const createdMockOrder = await Order.create({
          userId: createdMockUser._id,
          items: [{itemId: createdMockItem._id, quantity}],
          total: createdMockItem.price * quantity,
          status: 'New',
          address: 'test-address',
          recipient: 'test-recipient'
        });
        const { _id } = createdMockOrder;

        const statusToUpdate = 'Packed';
        const apiUrl = routePathUpdateOrder.replace(":id", _id);
        const res = await request(server).post(apiUrl).send({status: statusToUpdate});

        const redirectLocation = `/admin/orders`;
        expect(res.statusCode).toEqual(302);
        expect(res.headers.location).toEqual(redirectLocation);

        const retrievedMockOrder = await Order.findById(_id).lean();
        expect(retrievedMockOrder.status).toEqual(statusToUpdate);
      });
    });
  })



  describe('negative tests: Orders - User', () =>
  {
    describe(`GET "${routePathProfileGetOrderById}"`, () => {
      it('should return 404 when USER attempts to retrieve order they did not place', async () => {
        testBase.setupTemplateOutputAsJson();
        const createdMockUser = await User.create(testBase.mockUsers[0]);
        const createdMockAdmin = await User.create(testBase.mockUsers[1]);
        const createdMockItem = await Item.create(testBase.mockItems[0]);
        isLoggedIn.mockImplementation(async (req, res, next) => {
          req.flash = (status, message) => [status, message];
          req.isAuthenticated = () => true;
          req.user = { id: createdMockUser._id.toString(), roles: ['user'], }; 
          next();
        });

        const quantity = 1;
        const mockOrder = await Order.create({
          userId: createdMockAdmin._id,
          items: [{itemId: createdMockItem._id, quantity}],
          total: createdMockItem.price * quantity,
          status: 'New',
          address: 'test-address1',
          recipient: 'test-recipient1'
        });

        const apiUrl = routePathProfileGetOrderById.replace(":id", mockOrder._id);
        const res = await request(server).get(apiUrl).send();
        
        expect(res.statusCode).toEqual(404);
      });
    });

  })



  describe('positive tests: Orders - User', () =>
  {
    describe(`GET "${routePathProfileGetOrders}"`, () => {
      it('should successfully get all orders data made by USER', async () => {
        testBase.setupTemplateOutputAsJson();
        const createdMockUser = await User.create(testBase.mockUsers[0]);
        const createdMockAdmin = await User.create(testBase.mockUsers[1]);
        const createdMockItem1 = await Item.create(testBase.mockItems[0]);
        const createdMockItem2 = await Item.create(testBase.mockItems[1]);
        isLoggedIn.mockImplementation(async (req, res, next) => {
          req.flash = (status, message) => [status, message];
          req.isAuthenticated = () => true;
          req.user = { id: createdMockUser._id, roles: ['user'], }; 
          next();
        });

        const quantity = 1;
        const mockOrder1 = await Order.create({
          userId: createdMockUser._id,
          items: [{itemId: createdMockItem1._id, quantity}],
          total: createdMockItem1.price * quantity,
          status: 'New',
          address: 'test-address1',
          recipient: 'test-recipient1'
        });
        const mockOrder2 = await Order.create({ //order NOT created by user
          userId: createdMockAdmin._id,
          items: [
            {itemId: createdMockItem1._id, quantity},
            {itemId: createdMockItem2._id, quantity}
          ],
          total: createdMockItem1.price * quantity,
          status: 'New',
          address: 'test-address2',
          recipient: 'test-recipient2'
        });
        //await testBase.createMockOrders([mockOrder1, mockOrder2]);

        const apiUrl = routePathProfileGetOrders;
        const res = await request(server).get(apiUrl).send();
        
        expect(res.statusCode).toEqual(200); 
        const resOrders = JSON.parse(res.text).orders;
        expect(resOrders.length).toEqual(1);

        const retrievedUserOrder = await orderDAO.getById(mockOrder1._id);
        expect(resOrders[0]).toMatchObject(JSON.parse(JSON.stringify(retrievedUserOrder)));
      });
    });

    describe(`GET "${routePathProfileGetOrderById}"`, () => {
      it('should successfully get a single order made by USER', async () => {
        testBase.setupTemplateOutputAsJson();
        const createdMockUser = await User.create(testBase.mockUsers[0]);
        const createdMockItem = await Item.create(testBase.mockItems[0]);
        isLoggedIn.mockImplementation(async (req, res, next) => {
          req.flash = (status, message) => [status, message];
          req.isAuthenticated = () => true;
          req.user = { id: createdMockUser._id.toString(), roles: ['user'], }; 
          next();
        });

        const quantity = 1;
        const mockOrder = await Order.create({
          userId: createdMockUser._id,
          items: [{itemId: createdMockItem._id, quantity}],
          total: createdMockItem.price * quantity,
          status: 'New',
          address: 'test-address1',
          recipient: 'test-recipient1'
        });

        const apiUrl = routePathProfileGetOrderById.replace(":id", mockOrder._id);
        const res = await request(server).get(apiUrl).send();
        
        expect(res.statusCode).toEqual(200); 
        const resOrder = JSON.parse(res.text).order

        const retrievedUserOrder = await orderDAO.getById(mockOrder._id);
        expect(resOrder).toMatchObject(JSON.parse(JSON.stringify(retrievedUserOrder)));
      });
    });

  })

});