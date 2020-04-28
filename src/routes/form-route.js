const router = require('express').Router();
const validator = require('../middleware/validator');
const { isAuthUser } = require('../middleware/auth');
const { formSchema } = require('../joi-schemas');
const { formService } = require('../service');

router.get('/hospitals', isAuthUser, validator(formSchema.hospitals, 'query'), async (req, res) => {
  try {
    const hospitals = await formService.getHospitals(req.query.name, req.query.offset);
    return res.send({
      success: true,
      hospitals
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message
    });
  }
});
router.get('/locations/:type', isAuthUser, validator(formSchema.location, 'query'),
  validator(formSchema.locationType, 'params'), async (req, res) => {
    try {
      const locations = await formService.getLocation(req.query, req.params.type);
      return res.send({
        success: true,
        locations
      });
    } catch (e) {
      return res.status(500).json({
        message: e.message
      });
    }
  });
router.post('/persons', isAuthUser, validator(formSchema.person, 'body'), async (req, res) => {
  try {
    await formService.createPerson(req.body, req.session.user.userId);
    return res.send({
      success: true,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message
    });
  }
});
router.put('/persons/:id', isAuthUser, validator(formSchema.updatePerson, 'body'), async (req, res) => {
  try {
    const personRecord = await formService.isPersonExist(req.params.id);
    if (!personRecord) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    await formService.updatePerson(req.body, personRecord, req.session.user.userId);
    return res.send({
      success: true,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message
    });
  }
});
router.get('/persons/:id', isAuthUser, validator(formSchema.getPerson, 'params'), async (req, res) => {
  try {
    const person = await formService.getPerson(req.params.id);
    return res.send({
      success: true,
      details: person
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message
    });
  }
});
module.exports = router;
