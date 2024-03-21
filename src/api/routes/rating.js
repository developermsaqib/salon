const ratingRouter = require('express').Router();
const ratingController = require('../controllers/ratingController');

ratingRouter.post('/add', ratingController.addRating);
ratingRouter.post('/add-rating-to-salon', ratingController.addRatingToSalon);
ratingRouter.get('/find/:id', ratingController.findRating);
ratingRouter.get('/top-salons', ratingController.topSalons);

module.exports = ratingRouter;