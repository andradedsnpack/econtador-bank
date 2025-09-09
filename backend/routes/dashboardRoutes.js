const express = require('express');
const DashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Obtém dados do dashboard
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dados do dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalBalance:
 *                   type: number
 *                 income:
 *                   type: number
 *                 expenses:
 *                   type: number
 *                 accountsCount:
 *                   type: number
 *                 transfersCount:
 *                   type: number
 *                 chartData:
 *                   type: array
 */
router.get('/', DashboardController.getDashboard);

module.exports = router;