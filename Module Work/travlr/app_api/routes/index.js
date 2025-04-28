const express = require('express');
const router = express.Router();
const { expressjwt: expressJwt } = require('express-jwt');

const auth = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "payload",
    algorithms: ["HS256"],
    clockTolerance: 5
});

const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

router.post('/login', authController.login);
router.post('/register', authController.register);

router.route('/trips')
    .get(tripsController.tripList)
    .post(auth, tripsController.tripsAddTrip);

router.route('/trips/:tripCode')
    .get(tripsController.tripFindByCode)
    .put(auth, tripsController.tripsUpdateTrip)
    .delete(auth, tripsController.tripsDeleteTrip);

module.exports = router;
