const server = require("./server");
const Item = require('./models/items');
const Order = require('./models/order');


const mockUsers = [
  {
    "email": "user@test-email.com",
    "password": "user01PwdPwd!",
    "roles": ['user'],
  },
  {
    "email": "admin@test-email.com",
    "password": "admin01PwdPwd!",
    "roles": ['admin'],
  },
];

const mockItems = [
  { 
    "title": "Vanilla", 
    "size": "Pint", 
    "price": 1, 
    "imagePath": "vanilla.jpg", 
    "description": "description-vanilla", 
    "story": "story-vanilla" 
  },
  { 
    "title": "Chocolate", 
    "size": "Pint", 
    "price": 2,
    "imagePath": "chocolate.jpg", 
    "description": "description-chocolate", 
    "story": "story-chocolate" 
  },
  { 
    "title": "Cookies N' Cream", 
    "size": "Pint", 
    "price": 3,
    "imagePath": "cookies-n-cream.jpg", 
    "description": "description-cookies-n-cream", 
    "story": "story-cookies-n-cream" 
  },
  { 
    "title": "Mint Chocolate Chip",
    "size": "Pint", 
    "price": 4,
    "imagePath": "mint-chocolate-chip.jpg", 
    "description": "description-mint-chocolate-chip", 
    "story": "story-mint-chocolate-chip" 
  },
];
module.exports = { mockItems, mockUsers }

module.exports.setupTemplateOutputAsJson = () => {
  server.engine('.hbs', (path, options, callback) => {
    callback(null, JSON.stringify(options));
  });
}

module.exports.mockIsPublic = async (req, res, next) => {
  req.flash = (status, message) => [status, message];
  next();
};

module.exports.mockIsLoggedInAsUser = async (req, res, next) => {
  req.flash = (status, message) => [status, message];
  req.isAuthenticated = () => true;
  req.user = { roles: ['user'], }; 
  next();
}

module.exports.mockIsLoggedInAsAdmin = async (req, res, next) => {
  req.flash = (status, message) => [status, message];
  req.isAuthenticated = () => true;
  req.user = { roles: ['admin'], }; 
  next();
}

module.exports.mockIsLoggedInFalse = async (req, res, next) => {
  req.flash = (status, message) => [status, message];
  req.isAuthenticated = () => false;
  req.user = { roles: [], };
  next();
}

const roleNameAdmin = 'admin';
module.exports.mockIsAdmin = async (req, res, next) => {
  if (req.user.roles.includes(roleNameAdmin)) {
    next();
  } else {
    res.sendStatus(403);
  }
};

module.exports.createMockItems = async (dataArr) => {
  let items =[];
  for (const doc of dataArr) { 
    const created = await Item.create(doc);
    items.push(JSON.parse(JSON.stringify(created)));
  }
  return items;
}

module.exports.createMockOrders = async (dataArr) => {
  let orders =[];
  for (const doc of dataArr) { 
    const created = await Order.create(doc);
    orders.push(JSON.parse(JSON.stringify(created)));
  }
  return orders;
}