const { medicalOfficer } = require('../models');

module.exports = {
  login: async (userName, password) => {
    try {
      const medicalOfficerRecord = await medicalOfficer.findByPk(userName);
      const passwordCompare = medicalOfficerRecord.first_login_indicator ?
        password === medicalOfficerRecord.password :
        await medicalOfficerRecord.validPassword(password);
      if (passwordCompare) {
        return [true, medicalOfficerRecord.first_login_indicator];
      }
      return [false];
    } catch (e) {
      throw e;
    }
  },
  changePassword: async (userName, password) => {
    try {
      const medicalOfficerRecord = await medicalOfficer.findOne({
        where: {
          officer_id: userName,
          first_login_indicator: true
        }
      });
      if(medicalOfficerRecord.password === password) {
        return false;
      }
      medicalOfficerRecord.password = password;
      medicalOfficerRecord.first_login_indicator = false;
      await medicalOfficerRecord.save();
      return true;
    } catch (e) {
      throw e;
    }
  }
};
