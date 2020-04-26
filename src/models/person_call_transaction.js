/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const personCall = sequelize.define('person_call_transaction', {
    person_identifier: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    call_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    call_date: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true
    },
    current_address_key: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    person_status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    attender_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    attender_phone_number: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    symptoms: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date_of_first_symptom: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    date_admitted_in_hospital: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    hospital_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      primaryKey: true
    },
    tested_positive: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    tested_negative: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    date_of_discharge: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    tableName: 'person_call_transaction',
    timestamps: false
  });
  personCall.associate = (db) => {
    personCall.belongsTo(db['personDetails'], {foreignKey: 'person_identifier'});
    personCall.belongsTo(db['hospitals'], {as: 'hospital', foreignKey: 'hospital_id'});
    personCall.belongsTo(db['address'], {foreignKey: 'current_address_key'});
  };
  return personCall
};
