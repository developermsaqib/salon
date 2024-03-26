const express = require('express');
const dealRouter = express.Router();
const dealController = require('../controllers/dealController');

dealRouter.post('/create', dealController.createDeal);
dealRouter.get('/findAll', dealController.getAllDeals);
dealRouter.get('/findById/:id', dealController.getDealById);
dealRouter.put('/update/:id', dealController.updateDeal);
dealRouter.delete('/delete/:id', dealController.deleteDeal);

module.exports = dealRouter;
