const ensureAuthenticated = require('../Middlewares/Auth');
const router = require('express').Router();
const UserModel = require("../Models/User");
const MeterDataModel = require("../Models/MeterData");

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    // Find all users where superkey is null or blank string
    const users = await UserModel.find({
      $or: [
        { superkey: { $exists: false } }, // superkey missing
        { superkey: '' },                  // superkey empty string
        { superkey: null }                 // superkey null
      ]
    }).select('_id name'); // get only _id and name

    // Extract userIds
    const userIds = users.map(user => user._id.toString());

    // Find meter data for those users
    const meterDatas = await MeterDataModel.find({
      userId: { $in: userIds }
    }).select('userId reading date');

    // Combine user info with meter data
    const combinedData = meterDatas.map(meter => {
      // Find matching user for meter.userId
      const user = users.find(u => u._id.toString() === meter.userId.toString());
      return {
        userId: meter.userId,
        name: user ? user.name : 'Unknown',
        reading: meter.reading,
        date: meter.date.toISOString().split('T')[0]
      };
    });

    return res.status(200).json(combinedData);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Internal server error',
      success: false
    });
  }
});

module.exports = router;
