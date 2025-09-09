const DashboardService = require('../services/dashboardService');

class DashboardController {
  static async getDashboard(req, res) {
    try {
      const data = await DashboardService.getDashboardData(req.user.userId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = DashboardController;