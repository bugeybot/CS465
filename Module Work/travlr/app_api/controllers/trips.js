const mongoose = require('mongoose');
const Trip = require('../models/travlr');
const Model = mongoose.model('trips');
const User = require('../models/user');

const tripList = async (req, res) => {
    const q = await Model
        .find({})
        .exec();

    if (!q)
    {
        return res
            .status(404)
            .json(err);
    } else {
        return res
            .status(200)
            .json(q);
    }
};

const tripFindByCode = async (req, res) => {
    const q = await Model
        .find({'code' : req.params.tripCode})
        .exec();

    if (!q)
    {
        return res
            .status(404)
            .json(err);
    } else {
        return res
            .status(200)
            .json(q);
    }
};

const tripsAddTrip = async (req, res) => {
    getUser(req, res, (req, res) => {
        Trip.create({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        }, (err, trip) => {
            if (err) {
                return res
                    .status(400) // bad request
                    .json(err);
            } else {
                return res
                    .status(201) // created
                    .json(trip);
            }
        });
    });
};

const tripsUpdateTrip = async (req, res) => {
    getUser(req, res, (req, res) => {
        Trip
            .findOneAndUpdate(
                { 'code': req.params.tripCode },
                {
                    code: req.body.code,
                    name: req.body.name,
                    length: req.body.length,
                    start: req.body.start,
                    resort: req.body.resort,
                    perPerson: req.body.perPerson,
                    image: req.body.image,
                    description: req.body.description
                },
                { new: true }
            )
            .then(trip => {
                if (!trip) {
                    return res
                        .status(404)
                        .send({
                            message: "Trip not found with code " + req.params.tripCode
                        });
                }
                res.send(trip);
            })
            .catch(err => {
                if (err.kind === 'ObjectId') {
                    return res
                        .status(404)
                        .send({
                            message: "Trip not found with code " + req.params.tripCode
                        });
                }
                return res
                    .status(500) // server error
                    .json(err);
            });
    });
};

const tripsDeleteTrip = async (req, res) => {
    getUser(req, res, (req, res) => {
        Trip
            .findOneAndRemove({ 'code': req.params.tripCode })
            .then(trip => {
                if (!trip) {
                    return res
                        .status(404)
                        .send({
                            message: "Trip not found with code " + req.params.tripCode
                        });
                }
                res.send(trip);
            })
            .catch(err => {
                if (err.kind === 'ObjectId') {
                    return res
                        .status(404)
                        .send({
                            message: "Trip not found with code " + req.params.tripCode
                        });
                }
                return res
                    .status(500) // server error
                    .json(err);
            });
    });
};

const getUser = async (req, res, callback) => {
    console.log('Checking user authentication...');
  
    if (req.auth && req.auth.email) {
      console.log('Found auth email:', req.auth.email);
  
      try {
        const user = await User.findOne({ email: req.auth.email }).exec();
  
        if (!user) {
          console.log('User not found');
          return res.status(404).json({ message: "User not found" });
        }
  
        console.log('Authenticated user:', user.name);
        callback(req, res, user.name);
  
      } catch (err) {
        console.log('Error in user lookup:', err);
        return res.status(500).json(err);
      }
  
    } else {
      console.log('No auth payload found');
      return res.status(404).json({ message: "User not found" });
    }
  };
  

module.exports = {
    tripList,
    tripFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip
};