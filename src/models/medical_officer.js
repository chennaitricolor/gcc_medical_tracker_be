/* jshint indent: 2 */

const bcrypt = require('bcryptjs');

const generateHash = async password => await bcrypt.hash(password, await bcrypt.genSalt(8));

module.exports = function (sequelize, DataTypes) {
  const MedicalOfficer = sequelize.define('medical_officer', {
    officer_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    officer_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date: {
      type: DataTypes.CHAR,
      allowNull: true
    },
    officer_role: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone_numbers_alloted: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    phone_numbers_called: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    first_login_indicator: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'medical_officer',
    timestamps: false,
    hooks: {
      beforeCreate: async (attributes) => {
        attributes.password = await generateHash(attributes.password);
      },
      beforeUpdate: async (attributes) => {
        if (attributes.changed('password')) {
          attributes.password = await generateHash(attributes.password);
        }
      }
    }
  });

  MedicalOfficer.prototype.validPassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };
  return MedicalOfficer;
};
