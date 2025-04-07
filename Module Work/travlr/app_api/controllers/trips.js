const mongoose = require('mongoose');
const Trip = require('../models/travlr');
const Model = mongoose.model('trips');

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

module.exports = {
    tripList,
    tripFindByCode
};