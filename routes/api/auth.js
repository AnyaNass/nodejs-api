const express = require('express');

const controller = require("../../controllers/auth")

const { validateBody, authtenticate } = require("../../middlewares")

const { schemas } = require('../../models/user')

const router = express.Router();

router.post("/signup", validateBody(schemas.signupSchema), controller.signup);

router.post("/login", validateBody(schemas.loginSchema), controller.login)

router.get("/current", authtenticate, controller.current)

router.get("/logout", authtenticate, controller.logout)

router.patch("/users", authtenticate, validateBody(schemas.subscriptionSchema), controller.edisSubscription)

module.exports = router;