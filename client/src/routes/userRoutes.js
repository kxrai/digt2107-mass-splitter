const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/email/:email', userController.getUserByEmail);
router.post('/create', userController.createUser);

module.exports = router;
