const { address, zones, personDetails,
  personCallTransaction, Sequelize } = require('../models');

const getZones = async () => {
  try {
    const zoneRecords = await zones.findAll({
      group: ['zone'],
      attributes: [
        [Sequelize.literal(
          `STRING_AGG(distinct ward::varchar,',')`),
          'ward'],
        'zone'
      ],
    });
    return zoneRecords;
  } catch (e) {
    throw e;
  }
};

const getPersons = async (ward, {offset=0, name, gender, age, currentAddress, permanentAddress, healthStatus  }={}) => {
  try {
    const conditions = {
      where: {
        ...(name && {
          name: {
            [Sequelize.Op.substring]: name
          }
        }),
        ...(gender && {
          gender: {
            [Sequelize.Op.eq]: gender
          }
        }),
        ...(age && {
          age: {
            [Sequelize.Op.gte]: age
          }
        }),
      }
    };
    const personCallTransactionCondition = {
      where: {
        ...(healthStatus && {
          health_status: {
            [Sequelize.Op.substring]: healthStatus
          }
        }),
      }
    };
    const transactionRecords = await personDetails.findAndCountAll({
      limit: 10,
      offset,
      include: [
        {
          model: address,
          as: 'currentAddress',
          required: true,
          attributes: [
            ['street_name', 'street'],
            'area',
            ['city_or_district', 'city'],
            'state',
            ['pin_code', 'pinCode']
          ],
          include: [
            {
              model: zones,
              required: true,
              where: {
                ward: {
                  [Sequelize.Op.eq]: ward
                }
              },
              attributes: {
                exclude: Object.keys(zones.rawAttributes)
              }
            }
          ]
        },
        {
          model: address,
          as: 'permanentAddress',
          required: true,
          attributes: [
            ['street_name', 'street'],
            'area',
            ['city_or_district', 'city'],
            'state',
            ['pin_code', 'pinCode']
          ],
        },
        {
          model: personCallTransaction,
          required: true,
          limit: 1,
          order: [ [ 'call_date', 'DESC' ]],
          attributes: ['call_date', ['person_status','health_status']],
          ...personCallTransactionCondition
        }
      ],
      attributes: [
        'name', 'age', 'gender', ['createdAt', 'trackingSince']
      ],
      ...conditions
    });
    return transactionRecords;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  getZones,
  getPersons
};
