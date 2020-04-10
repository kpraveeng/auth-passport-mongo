//const express = require('express');
const router = require("express-promise-router")();
const passport = require("passport");

const passportConf = require("../passport");
const { validateBody, schemas } = require("../helpers/routeHelpers");
const UsersController = require("../controllers/users");
const passportSignIn = passport.authenticate("local", { session: false });
const passportJWT = passport.authenticate("jwt", { session: false });

router.route("/signup")
  .post(validateBody(schemas.signUpSchema), UsersController.signUp);

router.route("/signin")
  .post(validateBody(schemas.signInSchema),
    passportSignIn,
    UsersController.signIn
  );

router.route("/refreshToken").get(passportJWT, UsersController.refreshToken);

module.exports = router;
