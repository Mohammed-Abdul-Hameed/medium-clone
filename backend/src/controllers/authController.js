import authService from '../services/authService.js';

class AuthController {
  /**
   * @route   POST /api/auth/signup
   * @desc    Register a new user
   * @access  Public
   */
  async signup(req, res, next) {
    try {
      const { username, email, password } = req.body;

      const result = await authService.signup({ username, email, password });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: result.user,
          token: result.token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   POST /api/auth/login
   * @desc    Login user
   * @access  Public
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await authService.login({ email, password });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          token: result.token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   GET /api/auth/me
   * @desc    Get current user
   * @access  Private
   */
  async getCurrentUser(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
