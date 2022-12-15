const express = require('express');

const controller = require("../../controllers/contacts")

const { validateBody } = require("../../middlewares");

const { addSchema, updateFavoriteSchema } = require("../../models/contact")

const router = express.Router()

router.get('/', controller.getAll)

router.get('/:contactId', controller.getById)

router.post('/', validateBody(addSchema), controller.addContact)

router.delete('/:contactId', controller.deleteContact)

router.put('/:contactId', validateBody(addSchema), controller.updateContact)

router.patch('/:contactId/favorite', validateBody(updateFavoriteSchema), controller.updateStatusContact)

module.exports = router
