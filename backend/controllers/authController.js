const AuthService = require('../services/authService');

class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password, confirmPassword } = req.body;
      
      if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      }
      
      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Senhas não coincidem' });
      }
      
      const result = await AuthService.register({ name, email, password });
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
      }
      
      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
}

module.exports = AuthController;