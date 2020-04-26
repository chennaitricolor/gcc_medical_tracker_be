/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const personDetails = sequelize.define('person_details', {
    person_identifier: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    permanent_address_key: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    current_address_key: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    gender: {
      type: DataTypes.CHAR,
      allowNull: true
    },
    passport_no: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    secondary_phone_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone_number_valid: {
      type: DataTypes.CHAR,
      allowNull: true
    },
    travel_history_indicator: {
      type: DataTypes.CHAR,
      allowNull: true
    },
    country_visited: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date_of_arrival: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true
    },
    number_of_family_members: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    diabetes_indicator: {
      type: DataTypes.CHAR,
      allowNull: true
    },
    hypertension_indicator: {
      type: DataTypes.CHAR,
      allowNull: true
    },
    other_illness: {
      type: DataTypes.STRING,
      allowNull: true
    },
    person_status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contractedby: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    createdby: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    updatedby: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    tableName: 'person_details',
    timestamps: false
  });
  personDetails.associate = (db) => {
    personDetails.belongsTo(db['medicalOfficer'], {as: 'createdBy', foreignKey: 'createdby'});
    personDetails.belongsTo(db['medicalOfficer'], {as: 'updatedBy', foreignKey: 'updatedby'});
    personDetails.belongsTo(personDetails, {as: 'contractedBy', foreignKey: 'contractedby'});
    personDetails.belongsTo(db['address'], {as: 'permanentAddress', foreignKey: 'permanent_address_key'});
    personDetails.belongsTo(db['address'], {as: 'currentAddress', foreignKey: 'current_address_key'});
    personDetails.hasMany(db['personCallTransaction'], {foreignKey: 'person_identifier'});
  };
  return personDetails;
};
