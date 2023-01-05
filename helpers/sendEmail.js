const sgMail = require("@sendgrid/mail");

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
	const email = { ...data, from: 'aaaananas1@gmail.com' };
	await sgMail.send(email);
	return true;
}

const email = {
	to: 'yicop64521@cnxcoin.com',
	from: 'aaaananas1@gmail.com',
	subject: 'Verify you mail',
	html: `<p>Please, verify you mail</p>`
}

module.exports = sendEmail;