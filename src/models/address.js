/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const address = sequelize.define('address', {
    address_key: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    building_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    flat_building_no_and_floor: {
      type: DataTypes.CHAR,
      allowNull: true
    },
    street_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address_line_2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    area: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city_or_district: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pin_code: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    location_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'address',
    timestamps: false
  });
  address.associate = (db) => {
    address.belongsTo(db['zones'], { foreignKey: 'location_id'})
  };
  return address
};
