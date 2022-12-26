const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

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

	const newUser = await User.create({ ...req.body, password: hashPassword });

	res.status(201).json({
		email: newUser.email,
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
		token,
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

module.exports = {
	signup: controllerWrapper(signup),
	login: controllerWrapper(login),
	current: controllerWrapper(current),
	logout: controllerWrapper(logout),
	edisSubscription: controllerWrapper(edisSubscription),
}
