const express = require('express');
const TransferController = require('../controllers/transferController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

/**
 * @swagger
 * /api/transfers:
 *   get:
 *     summary: Lista transferências do usuário
 *     tags: [Transfers]
 *     responses:
 *       200:
 *         description: Lista de transferências
 */
router.get('/', TransferController.getTransfers);

/**
 * @swagger
 * /api/transfers:
 *   post:
 *     summary: Cria uma nova transferência
 *     tags: [Transfers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromAccountId
 *               - toAccountNumber
 *               - toAgency
 *               - amount
 *             properties:
 *               fromAccountId:
 *                 type: string
 *               toAccountNumber:
 *                 type: string
 *               toAgency:
 *                 type: string
 *               amount:
 *                 type: number
 *                 maximum: 5000
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transferência criada com sucesso
 *       400:
 *         description: Erro de validação
 */
router.post('/', TransferController.createTransfer);

module.exports = router;