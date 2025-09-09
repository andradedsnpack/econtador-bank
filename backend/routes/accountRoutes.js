const express = require('express');
const AccountController = require('../controllers/accountController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/banks', AccountController.getBanks);
router.use(authenticateToken);

router.get('/', AccountController.getAccounts);
router.post('/', AccountController.createAccount);
router.put('/:id', AccountController.updateAccount);
router.delete('/:id', AccountController.deleteAccount);

module.exports = router;