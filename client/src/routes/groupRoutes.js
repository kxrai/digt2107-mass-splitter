const express = require('express');
const groupController = require('../controllers/groupController');
const router = express.Router();

router.get('/', groupController.getAllGroups);
router.get('/:id', groupController.getGroupById);
router.get('/name/:groupName', groupController.getGroupByName);
router.post('/create', groupController.createGroup);
router.post('/addMemeber', groupController.addMember);
router.put('/:id', groupController.updateGroup);
router.delete('/:id', groupController.deleteGroup);

module.exports = router;
