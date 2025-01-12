const express = require('express');
const friendController = require('../controllers/friendController');

const router = express.Router();

router.get('/', friendController.getAllFriends);
router.get('/:user_id', friendController.getFriendById);
router.post('/', friendController.createFriend);
router.put('/:user_id', friendController.updateFriend);
router.delete('/:user_id', friendController.deleteFriend);

module.exports = router;
