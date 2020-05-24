const { address, zones, personDetails,
  personCallTransaction, Sequelize, sequelize } = require('../models');

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

const getPersons = async (ward, {offset=1, name, gender, age, currentAddress, permanentAddress, healthStatus, phoneNumber }={}) => {
  try {
    const conditions = {
      where: {
        ...(name && {
          name: {
            [Sequelize.Op.substring]: name
          }
        }),
        ...(phoneNumber && {
          phone_number: {
            [Sequelize.Op.substring]: phoneNumber
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
      offset:((offset-1)*10),
      limit: 10,
      subQuery:false,
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
        'name', 'age', 'gender', 'phone_number', ['createdAt', 'trackingSince']
      ],
      ...conditions
    });
    return transactionRecords;
  } catch (e) {
    throw e;
  }
};

const getPersonsMap = async () => {
  try {
    const transactionRecords = await sequelize.query(`SELECT jsonb_object_agg(t.locationVal, t.person) as result from 
    (SELECT concat_ws(',', zones.longitude , zones.latitude ) as locationVal, array_agg(json_build_object('name',person_details."name", 'gender',person_details.gender, 'phone', person_details.phone_number )) as person
    FROM zones
    INNER JOIN address
    ON address.location_id = zones.location_id
    INNER JOIN person_details
    ON person_details.current_address_key = address.address_key
    GROUP BY locationVal) t;`)
    return transactionRecords.length && transactionRecords[0][0].result;
  } catch (e) {
    throw e;
  }
};


module.exports = {
  getZones,
  getPersons,
  getPersonsMap
};
