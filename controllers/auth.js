const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp')

const { User } = require("../models/user");

const { HttpError, controllerWrapper } = require("../helpers")

const { SECRET_KEY } = process.env;

const signup = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user) {
		throw HttpError(409, "Email in use")
	}

	const hashPassword = await bcrypt.hash(password, 10)
	const avatarURL = gravatar.url(email)

	const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });

	const payload = {
		id: newUser._id,
	}

	const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" })
	await User.findByIdAndUpdate(newUser._id, { token })

	res.status(201).json({
		email: newUser.email,
		subscription: newUser.subscription,
		token
	})
}

const login = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (!user) {
		throw HttpError(401, "Email or password is wrong")
	}

	const passwordCompare = await bcrypt.compare(password, user.password);
	if (!passwordCompare) {
		throw HttpError(401, "Email or password is wrong")
	}

	const payload = {
		id: user._id,
	}

	const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" })
	await User.findByIdAndUpdate(user._id, { token })

	res.json({
		email: user.email,
		subscription: user.subscription,
		token
	})
}

const current = async (req, res) => {
	const { email, subscription } = req.user;

	res.json({ email, subscription });
}

const logout = async (req, res) => {
	const { _id } = req.user;
	await User.findByIdAndUpdate(_id, { token: "" });

	res.status(204);

}

const edisSubscription = async (req, res) => {
	const subscriptionOptions = ["starter", "pro", "business"];
	const { _id } = req.user;

	if (!subscriptionOptions.includes(req.body.subscription)) {
		throw HttpError(400)
	}

	const result = await User.findByIdAndUpdate(_id, req.body, { new: true })

	if (!result) {
		throw HttpError(404)
	}

	res.status(200).json(result)
}

const avatarsDir = path.join(__dirname, "../", "public", "avatars")

const updateAvatar = async (req, res) => {
	const { _id } = req.user;
	const { path: tempUpload, originalname } = req.file;

	const avatar = await Jimp.read(tempUpload);
	avatar.resize(250, 250);
	avatar.write(tempUpload);

	const filename = `${_id}${originalname}`
	const resultUpload = path.join(avatarsDir, filename);
	await fs.rename(tempUpload, resultUpload);
	const avatarURL = path.join("avatars", filename);
	await User.findByIdAndUpdate(_id, { avatarURL })

	res.json({
		avatarURL,
	})
}

module.exports = {
	signup: controllerWrapper(signup),
	login: controllerWrapper(login),
	current: controllerWrapper(current),
	logout: controllerWrapper(logout),
	edisSubscription: controllerWrapper(edisSubscription),
	updateAvatar: controllerWrapper(updateAvatar),
}

