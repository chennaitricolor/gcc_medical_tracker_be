/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('call_transaction', {
    call_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    call_date: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true
    },
    person_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    phone_number_dialed: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    doctor_or_medical_officer_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    call_successful_indicator: {
      type: DataTypes.CHAR,
      allowNull: true
    },
    wrong_number_indicator: {
      type: DataTypes.CHAR,
      allowNull: true
    },
    call_not_responding_indicator: {
      type: DataTypes.CHAR,
      allowNull: true
    },
    incorrect_phone_number: {
      type: DataTypes.CHAR,
      allowNull: true
    },
    answered_by: {
      type: DataTypes.STRING,
      allowNull: true
    },
    suspected_flag: {
      type: DataTypes.CHAR,
      allowNull: true
    },
    inbound_or_outbound: {
      type: DataTypes.CHAR,
      allowNull: true
    }
  }, {
    tableName: 'call_transaction',
    timestamps: false
  });
};
