const router = require('express').Router();
const validator = require('../middleware/validator');
const { isTempUser } = require('../middleware/auth');
const { authSchema } = require('../joi-schemas');
const { authService } = require('../service');

router.post('/login', validator(authSchema.login, 'body'), async (req, res) => {
  try {
    const loginResponse = await authService.login(req.body.username, req.body.password);
    if (loginResponse[0]) {
      req.session.user = {
        userId: req.body.username,
        isTempUser: loginResponse[1]
      };
      return res.send({
        success: true
      });
    }
    throw new Error('Invalid Credentials');
  } catch (e) {
    return res.status(401).json({
      message: e.message
    });
  }
});
router.post('/change-password', isTempUser, validator(authSchema.changePassword, 'body'), async (req, res) => {
  try {
    const response = await authService.changePassword(req.session.user.userId, req.body.password);
    if (response) {
      req.session.user.isTempUser = false;
      return res.send({
        success: true
      });
    } else {
      return res.status(401).send({
        message: 'New password same as old password'
      });
    }
  } catch (e) {
    return res.status(401).json({
      message: e.message
    });
  }
});

module.exports = router;
