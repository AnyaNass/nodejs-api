const { Schema, model } = require("mongoose");
const Joi = require('joi');
const { handleMongooseError } = require("../helpers")

const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

const userSchema = new Schema(
	{
		password: {
			type: String,
			required: [true, 'Password is required'],
			minlength: 6,
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			match: EMAIL_REGEXP,
			unique: true,
		},
		subscription: {
			type: String,
			enum: ["starter", "pro", "business"],
			default: "starter"
		},
		token: {
			type: String,
			default: null,
		},
	}, { versionKey: false }
)

userSchema.post("save", handleMongooseError);

const signupSchema = Joi.object({
	email: Joi.string().pattern(EMAIL_REGEXP).required(),
	password: Joi.string().min(6).required()
})

const loginSchema = Joi.object({
	email: Joi.string().pattern(EMAIL_REGEXP).required(),
	password: Joi.string().min(6).required()
})

const subscriptionSchema = Joi.object({
	subscription: Joi.string().required()
})

const schemas = {
	signupSchema,
	loginSchema,
	subscriptionSchema
}

const User = model("user", userSchema);

module.exports = {
	User,
	schemas
}