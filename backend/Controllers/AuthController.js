const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");


const signup = async (req, res) => {
    try {
        const { superkey, name, email, password } = req.body;
        if( superkey && superkey !== process.env.SUPERKEY){
             return res.status(409)
                .json({ message: 'Valid superkey required to Signup.', success: false });
        }
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User is already exist, you can login', success: false });
        }
        const userModel = new UserModel({superkey, name, email, password });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201)
            .json({
                message: "Signup successfully",
                success: true,
                superAdmin: superkey ? 1 : 0,
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}


const login = async (req, res) => {
  try {
    const { superkey, email, password } = req.body;
    const errorMsg = 'Auth failed: email or password is wrong';

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    const userHasSuperkey = user.superkey && user.superkey.trim() !== "";
    const requestHasSuperkey = superkey && superkey.trim() !== "";

    //User has superkey, but superkey is missing or invalid in request
    if (userHasSuperkey) {
      if (!requestHasSuperkey || superkey !== user.superkey || superkey !== process.env.SUPERKEY) {
        return res.status(403).json({
          message: 'Admin account detected. Valid superkey required to login.',
          success: false,
        });
      }
    }

    // CASE 2: User has NO superkey, but request tries to login as admin
    if (!userHasSuperkey && requestHasSuperkey) {
      return res.status(403).json({
        message: 'This user is not an admin. Superkey should not be provided.',
        success: false,
      });
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login Success',
      success: true,
      jwtToken,
      email,
      name: user.name,
      superAdmin: userHasSuperkey ? 1 : 0,
    });

  } catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};


module.exports = {
    signup,
    login
}