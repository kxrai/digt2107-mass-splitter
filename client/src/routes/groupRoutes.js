const express = require('express');
const groupController = require('../controllers/groupController');
const router = express.Router();

// All group related routes
router.get('/email/:email', groupController.getAllGroups);
router.get('/members/:id', groupController.getAllMembers);
router.get('/:id', groupController.getGroupById);
router.get('/name/:name', groupController.getGroupByName);
router.post('/create', groupController.createGroup);
router.post('/addMember', groupController.addMember);
router.delete('/:id', groupController.deleteGroup);

module.exports = router;
