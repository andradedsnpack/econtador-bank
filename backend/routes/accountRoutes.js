const express = require('express');
const AccountController = require('../controllers/accountController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/accounts/banks:
 *   get:
 *     summary: Lista bancos disponíveis
 *     tags: [Accounts]
 *     security: []
 *     responses:
 *       200:
 *         description: Lista de bancos
 */
router.get('/banks', AccountController.getBanks);
router.use(authenticateToken);

/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Lista contas do usuário
 *     tags: [Accounts]
 *     responses:
 *       200:
 *         description: Lista de contas
 */
router.get('/', AccountController.getAccounts);

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     summary: Cria uma nova conta
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountNumber
 *               - agency
 *               - bank
 *               - password
 *             properties:
 *               accountNumber:
 *                 type: string
 *               agency:
 *                 type: string
 *               bank:
 *                 type: string
 *               password:
 *                 type: string
 *               balance:
 *                 type: number
 *     responses:
 *       201:
 *         description: Conta criada com sucesso
 */
router.post('/', AccountController.createAccount);

/**
 * @swagger
 * /api/accounts/{id}:
 *   put:
 *     summary: Atualiza uma conta
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conta atualizada
 */
router.put('/:id', AccountController.updateAccount);

/**
 * @swagger
 * /api/accounts/{id}:
 *   delete:
 *     summary: Exclui uma conta
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Conta excluída
 */
router.delete('/:id', AccountController.deleteAccount);

module.exports = router;