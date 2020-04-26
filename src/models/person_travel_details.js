/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const personTravelDetails = sequelize.define('person_travel_details', {
    place_of_visit: {
      type: DataTypes.STRING,
      allowNull: true
    },
    place_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address_key: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    person_identifier: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    date_and_time_of_travel: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true
    },
    mode_of_travel: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'person_travel_details',
    timestamps: false
  });
  personTravelDetails.associate = (db) => {
    personTravelDetails.belongsTo(db['address'], {foreignKey: 'address_key'});
  };
  return personTravelDetails
};
