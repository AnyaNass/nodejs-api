const express = require('express');

const controller = require("../../controllers/auth")

const { validateBody, authtenticate, upload } = require("../../middlewares")

const { schemas } = require('../../models/user')

const router = express.Router();

router.post("/signup", validateBody(schemas.signupSchema), controller.signup);

router.post("/login", validateBody(schemas.loginSchema), controller.login)

router.get("/current", authtenticate, controller.current)

router.get("/logout", authtenticate, controller.logout)

router.patch("/users", authtenticate, validateBody(schemas.subscriptionSchema), controller.edisSubscription)

router.patch("/users/avatars", authtenticate, upload.single("avatar"), controller.updateAvatar)

router.get("/users/verify/:verificationToken", controller.verify)

router.post("/users/verify", validateBody(schemas.verifySchema), controller.resendVerifyEmail)

module.exports = router;