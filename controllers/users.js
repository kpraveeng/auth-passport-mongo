const JWT = require("jsonwebtoken");
const HTTPSTATUS = require("http-status-codes");

const User = require("../models/user");
const messages = require("../helpers/messages");
const { JWT_SECRET, TOKEN_EXPIRE_MINUTE, TOKEN_ISSUER } = require("../configuration");

signToken = (user) => {
  const tokenExpiresIn = TOKEN_EXPIRE_MINUTE * 60 * 1000;
  const token = JWT.sign(
    {
      iss: TOKEN_ISSUER,
      sub: user.id,
      iat: new Date().getTime(),
    },
    JWT_SECRET
  );

  var returnVal = { tokenExpiresIn, token };
  return returnVal;
};

module.exports = {
  signUp: async (req, res, next) => {
    const { name, email, password } = req.value.body;

    // Check if there is a user with the same email
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res
        .status(HTTPSTATUS.FORBIDDEN)
        .send({ error: messages.EMAIL_ALREADY_EXISTS });
    }

    // Create a new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Respond with Token
    res
      .status(HTTPSTATUS.OK)
      .json({ message: messages.USER_REGISTERATION_SUCCESS });
  },

  signIn: async (req, res, next) => {
    const requestFromsUser = req.user.toObject();
    const { password, _id, __v, ...User } = requestFromsUser;
    const { tokenExpiresIn, token } = signToken(req.user);
    const returnData = {
      User,
      token,
      tokenExpiresIn,
    };
    res.status(HTTPSTATUS.OK).json({ data: returnData });
  },

  refreshToken: async (req, res, next) => {
    const { tokenExpiresIn, token } = signToken(req.user);
    const returnData = {
      refreshToken: token,
      refreshTokenExpiresIn: tokenExpiresIn,
    };
    res.status(HTTPSTATUS.OK).json({ data: returnData });
  },
};
