const express = require('express');

const controller = require("../../controllers/contacts")

const { validateBody, authtenticate } = require("../../middlewares");

const { addSchema, updateFavoriteSchema } = require("../../models/contact")

const router = express.Router()

router.get('/', authtenticate, controller.getAll)

router.get('/:contactId', authtenticate, controller.getById)

router.post('/', authtenticate, validateBody(addSchema), controller.addContact)

router.delete('/:contactId', authtenticate, controller.deleteContact)

router.put('/:contactId', authtenticate, validateBody(addSchema), controller.updateContact)

router.patch('/:contactId/favorite', authtenticate, validateBody(updateFavoriteSchema), controller.updateStatusContact)

module.exports = router
