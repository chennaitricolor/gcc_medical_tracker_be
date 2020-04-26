/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const hospital =  sequelize.define('hospitals', {
    hospital_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    hospital_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone_number: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    address_key: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    number_of_quarantine: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_number_of_beds_: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    number_of_beds_available: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    number_of_ventilators: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    covid_testing_facility: {
      type: DataTypes.CHAR,
      allowNull: true
    },
    covid_treatment: {
      type: DataTypes.CHAR,
      allowNull: true
    },
    icu_facility: {
      type: DataTypes.CHAR,
      allowNull: true
    },
    ambulance_facility: {
      type: DataTypes.CHAR,
      allowNull: true
    }
  }, {
    tableName: 'hospitals',
    timestamps: false
  });

  hospital.associate = (db) => {
    hospital.belongsTo(db['address'], {foreignKey: 'address_key'});
  };
  return hospital;
};
