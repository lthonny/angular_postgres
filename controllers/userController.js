const userService = require('../service/user-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserController {
  async sign_up(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Eror validation', errors.array()));
      }
      const { name, email, password } = req.body;

      console.log();

      const userData = await userService.sign_up(name, email, password);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: false })
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async sign_in(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.sign_in(email, password);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: false, secure: false });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.status(200).send({message: 'Complete cleaning'});
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.refresh(refreshToken);
      res.cookie('refreshToken', token.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: false, secure: false})
      return res.json(token);
    } catch(e) {
      next(e);
    }
  }
}


module.exports = new UserController();