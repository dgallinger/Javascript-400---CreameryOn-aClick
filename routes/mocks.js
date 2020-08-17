/*
 * The purpose of the Mocks route and related files is to confirm project setup was successful,
 * by allowing individuals to verify they can browse these endpoints and run npm tests.
 */
const { Router } = require("express");
const router = Router();
const mockDAO = require('../daos/mock');


/*
 * Create mock ice cream list based on static data
 * POST /mocks
 */
router.post("/", async (req, res, next) => {
  try
  {
    const iceCreamList = [
      { "name": "Vanilla", "pricePerSingleScoop": 3.50},
      { "name": "Chocolate", "pricePerSingleScoop": 3.50},
      { "name": "Cookies N' Cream", "pricePerSingleScoop": 3.50},
      { "name": "Mint Chocolate Chip", "pricePerSingleScoop": 3.50},
      { "name": "Chocolate Chip Cookie Dough", "pricePerSingleScoop": 3.50},
      { "name": "Buttered Pecan", "pricePerSingleScoop": 5.50},
      { "name": "Cookie Dough", "pricePerSingleScoop": 5.50},
      { "name": "Strawberry", "pricePerSingleScoop": 5.50},
      { "name": "Moose Tracks", "pricePerSingleScoop": 5.50},
      { "name": "Neopolitan", "pricePerSingleScoop": 5.50}
    ];

    const max = 9, min = 0;
    const randomIdx = Math.floor(Math.random() * (max - min + 1) + min);

    const created = await mockDAO.create(iceCreamList[randomIdx]);

    res.json(created);
  }
  catch(err)
  {
    next(err);
  }
});


/*
 * Get mock ice cream list
 * GET /mocks
 */
router.get("/", async (req, res, next) => {
  try
  {
    const iceCreams = await mockDAO.getAll();
    res.json(iceCreams);
  }
  catch(err)
  {
    next(err);
  }
});


module.exports = router;