/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const zones = sequelize.define('zones', {
    location_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    street_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    area: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ward: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    zone: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: true
    }
  }, {
    tableName: 'zones',
    timestamps: false
  });
  return zones
};
