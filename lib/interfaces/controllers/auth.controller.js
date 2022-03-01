const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const GetUser = require('../../application/use_cases/get-user.usecase');
const CountUser = require('../../application/use_cases/count-user.usecase');
const CreateUser = require('../../application/use_cases/create-user.usecase');
const GetUserById = require('../../application/use_cases/get-user-by-id.usecase');
const serviceLocator = require("../../infrastructure/config/service-locator")

module.exports = {
  register: async (req, res) => {
    try {

      const { username, password } = req.body;

      const checkUsernameValid = /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/g.test(username);
      if (!checkUsernameValid) {
        return res.status(422).json({
          message: "format username invalid."
        });
      }

      const countUsers = await CountUser({ username }, serviceLocator);

      if (countUsers > 0) {
        return res.status(422).json({
          message: "The username already exists",
        });
      }
      const hashedPassword = bcrypt.hashSync(password, 8);
      const user = await CreateUser({ username, password: hashedPassword }, serviceLocator);
      return res.status(200).json({
        ...user
      });
    } catch (e) {
      return res.status(500).json({
        message: "500 internal server error.",
        detail: e
      });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const checkUsernameValid = /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/g.test(username);
      if (!checkUsernameValid) {
        return res.status(422).json({
          message: "format username invalid."
        });
      }

      const user = await GetUser({ username, status: "ACTIVE" }, serviceLocator)
      if (!user) {
        return res.status(404).json({
          message: "user not found"
        });
      }
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid)
        return res.status(401).json({
          message: "Password is not correct."
        });

      const token = jwt.sign(
        { id: user.id },
        Process.env.SERECT,
        {
          expiresIn: Process.env.TOKEN_EXPIRES_IN,
        }
      );
      return res.status(200).json({
        token,
        ...user
      });
    } catch (e) {
      return res.status(500).json({
        message: "500 internal server error.",
        detail: e
      });
    }
  },

  getMe: async (req, res) => {
    try {
      const user = await GetUserById(req.userId, serviceLocator);
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }
      return res.status(200).json({
        ...user
      });
    } catch (e) {
      return res.status(500).json({
        message: "500 internal server error.",
        detail: e
      });
    }
  },

};
