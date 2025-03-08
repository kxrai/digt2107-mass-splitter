const express = require('express');
const groupController = require('../controllers/groupController');
const router = express.Router();

router.get('/email/:email', groupController.getAllGroups);
router.get('/members/:id', groupController.getAllMembers);
router.get('/:id', groupController.getGroupById);
router.post('/create', groupController.createGroup);
router.post('/addMember', groupController.addMember);
router.delete('/:id', groupController.deleteGroup);

module.exports = router;
