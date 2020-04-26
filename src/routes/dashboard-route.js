const router = require('express').Router();
const { isAuthUser } = require('../middleware/auth');
const { dashboardService } = require('../service');
const validator = require('../middleware/validator');
const { dashboardSchema } = require('../joi-schemas');


router.get('/zones', isAuthUser, async (req, res) => {
  try {
    const zones = await dashboardService.getZones();
    return res.send({
      success: true,
      zones
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message
    });
  }
});

router.get('/wards/:id', isAuthUser, validator(dashboardSchema.getPersonsParam, 'params'),
  validator(dashboardSchema.getPersonsQuery, 'query'), async (req, res) => {
  try {
    const persons = await dashboardService.getPersons(req.params.id, req.query);
    return res.send({
      success: true,
      count: persons.count,
      persons: persons.rows,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message
    });
  }
});
module.exports = router;
