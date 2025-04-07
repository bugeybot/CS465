const express = require('express');
const router = express.Router();

const tripsController = require('../controllers/trips');

router
    .route('/trips')
    .get(tripsController.tripList);

router
    .route('/trips/:tripCode')
    .get(tripsController.tripFindByCode);

module.exports = router;