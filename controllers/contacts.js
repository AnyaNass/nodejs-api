
const { Contact } = require('../models/contact')

const { HttpError, controllerWrapper } = require("../helpers")

const getAll = async (req, res, next) => {
	const { _id: owner } = req.user;
	const { page = 1, limit = 10, favorite } = req.query;
	const skip = (page - 1) * limit;

	if (favorite) {
		const result = await Contact.find({ owner, favorite }, "", { skip, limit }).populate("owner", "email _id")
		res.status(200).json(result);
	}

	const result = await Contact.find({ owner }, "", { skip, limit }).populate("owner", "email _id")
	res.status(200).json(result);
}

const getById = async (req, res) => {
	const { contactId } = req.params;
	const result = await Contact.findById(contactId);

	if (!result) {
		throw HttpError(404)
	}

	res.status(200).json(result)
}

const addContact = async (req, res) => {
	const { _id: owner } = req.user;
	const result = await Contact.create({ ...req.body, owner });
	res.status(201).json(result)
}

const deleteContact = async (req, res) => {
	const { contactId } = req.params;
	const result = await Contact.findByIdAndDelete(contactId)

	if (!result) {
		throw HttpError(404);
	}

	res.status(200).json({ "message": "contact deleted" })
}

const updateContact = async (req, res) => {
	const { contactId } = req.params;
	const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

	if (!result) {
		throw HttpError(404)
	}

	res.status(200).json(result)
}

const updateStatusContact = async (req, res) => {
	const { contactId } = req.params;
	const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

	if (!result) {
		throw HttpError(404)
	}

	res.status(200).json(result)
}

module.exports = {
	getAll: controllerWrapper(getAll),
	getById: controllerWrapper(getById),
	addContact: controllerWrapper(addContact),
	updateContact: controllerWrapper(updateContact),
	deleteContact: controllerWrapper(deleteContact),
	updateStatusContact: controllerWrapper(updateStatusContact),
}