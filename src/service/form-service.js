const moment = require('moment');
const Promise = require("bluebird");
const { hospitals, address, zones,
  personDetails, callTransaction, personCallTransaction,
  personTravelDetails, medicalOfficer, Sequelize, sequelize } = require('../models');
const { BasicDetailDbMapper, AddressToDbMapper,
  PersonCallDetailDbMapper, TravelDetailToDbMapper, objectMapper } = require('../utils/requestToDbMappers');
const { PERSON_STATUS, CALL_TYPE } = require('../constants');

const getHospitals = async (hospitalName = '', offset) => {
  try {
    const { rows:hospitalsRecord } = await hospitals.findAndCountAll({
      where: Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('hospitals.hospital_name')),
        {
          [Sequelize.Op.substring]: hospitalName.toLowerCase()
        }
      ),
      include: [
        {
          model: address,
          required: true,
          attributes: [
            ['street_name', 'street'],
            'area',
            ['city_or_district', 'city'],
            'state',
            ['pin_code', 'pinCode']
          ]
        }
      ],
      attributes: [
        ['hospital_name', 'name'],
        ['hospital_id', 'id'],

      ],
      limit: 10,
      offset: offset,
    });
    return hospitalsRecord;
  } catch (e) {
    throw e;
  }
};
const getLocation = async (filter, group) => {
  try {
    const andArgs = [];
    const attributes = [];
    group === 'street_name' && attributes.push(
      ['location_id', 'id'],
      'street_name',
      'location',
      'area',
      'ward',
      'zone',
    );
    for (let key in filter)
      if (key !== 'zone' && key !== 'zone') {
        andArgs.push(Sequelize.where(
          Sequelize.fn('lower', Sequelize.col(key)),
          {
            [Sequelize.Op.substring]: filter[key].toLowerCase()
          }));
      } else {
        andArgs.push({
          [key]: {
            [Sequelize.Op.eq]: filter[key]
          }
        })
      }


    const zoneRecords = await zones.findAll({
      where: Sequelize.and(...andArgs),
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col(group)), group.split('_')[0]],
        ...attributes
      ],
    });
    return zoneRecords;
  } catch (e) {
    throw e;
  }
};
const createPerson = async (formData, userId) => {
  let createPersonTransaction;
  try {
    const currentTimestamp = moment().valueOf();
    createPersonTransaction = await sequelize.transaction();
    const staticMap = {
      phone_number_valid: 'Y',
      person_status: PERSON_STATUS.CLOSED,
      createdby: userId,
      updatedby: userId,
    };
    formData.basicDetails.currentAddress = formData.transactionDetails.currentAddressSame === 'N' ? formData.transactionDetails.currentAddress: undefined;
    formData.basicDetails.createdAt = currentTimestamp;
    const personDetailsObject = await constructPersonDetails(formData.basicDetails, staticMap, createPersonTransaction);

    formData.callDetails.personId = personDetailsObject.get('person_identifier');
    formData.callDetails.callDate = currentTimestamp;
    const callTransactionObject = await constructCallTransaction(formData.callDetails, userId, createPersonTransaction);

    formData.transactionDetails.callId = callTransactionObject.get('call_id');
    formData.transactionDetails.callDate = currentTimestamp;
    formData.transactionDetails.personId = personDetailsObject.get('person_identifier');
    formData.transactionDetails.address = personDetailsObject.get('current_address_key');
    await constructPersonCallTransaction(formData.transactionDetails, userId, createPersonTransaction);

    if (formData.travelDetails) {
      await constructPersonTravelDetails(formData.travelDetails, personDetailsObject.get('person_identifier'), createPersonTransaction);
    }

    if (formData.contractedPersons) {
      await constructPersonContractedDetails(formData.contractedPersons, personDetailsObject.get('person_identifier'), userId, createPersonTransaction, currentTimestamp);
    }
    await createPersonTransaction.commit();
  } catch (e) {
    if (createPersonTransaction)
      createPersonTransaction.rollback();
    throw  e
  }
};
const getPerson = async (personId) => {
  try {
    const getBasicDetails = async () => await personDetails.findByPk
    (personId, {
        include: [
          {
            model: address,
            as: 'permanentAddress',
            attributes: [
              ['street_name', 'street'],
              'area',
              ['city_or_district', 'city'],
              'state',
              ['pin_code', 'pinCode']
            ]
          },
          {
            model: address,
            as: 'currentAddress',
            attributes: [
              ['street_name', 'street'],
              'area',
              ['city_or_district', 'city'],
              'state',
              ['pin_code', 'pinCode']
            ]
          }, {
            model: personDetails,
            as: 'contractedBy',
            attributes: [
              ['person_identifier', 'name'],
            ]
          }, {
            model: medicalOfficer,
            as: 'createdBy',
            attributes: [
              ['officer_name', 'name'],
            ]
          }, {
            model: medicalOfficer,
            as: 'updatedBy',
            attributes: [
              ['officer_name', 'name'],
            ]
          }
        ],
        attributes: {
          exclude: ['updatedby', 'createdby', 'contractedby', 'person_identifier', 'permanent_address_key']
        }
      }
    );
    const getTravelDetails = async () => await personTravelDetails.findByPk
    (personId, {
        include: [
          {
            model: address,
            attributes: [
              ['street_name', 'street'],
              'area',
              ['city_or_district', 'city'],
              'state',
              ['pin_code', 'pinCode']
            ]
          }],
        attributes: {
          exclude: ['person_identifier', 'address_key']
        }
      }
    );
    const getPersonTransaction = async () => await personCallTransaction.findAll
    (
      {
        limit: 1,
        where: {
          person_identifier: personId
        },
        order: [['call_date', 'DESC']],
        include: [
          {
            model: address,
            attributes: [
              ['street_name', 'street'],
              'area',
              ['city_or_district', 'city'],
              'state',
              ['pin_code', 'pinCode']
            ]
          }, {
            model: hospitals,
            as: 'hospital',
            attributes: [
              ['hospital_name', 'name'],
            ]
          }
        ],
        attributes: {
          exclude: ['hospital_id', 'person_identifier', 'current_address_key', 'call_id']
        }
      }
    );
    const result = await Promise.all([
      getBasicDetails(),
      getTravelDetails(),
      getPersonTransaction()
    ]);
    return {
      basic: result[0],
      travel: result[1],
      lastCall: result[2][0] || null,
    };
  } catch (e) {
    throw e
  }
};
const isPersonExist = async (personId) => {
  try {
    const personRecord = await personDetails.findByPk(personId);
    return personRecord;
  } catch (e) {
    throw e
  }
};
const updatePerson = async (updateDetails, personRecord, officerId) => {
  let updatePersonTransaction;
  try {
    const currentTimestamp = moment().valueOf();
    updatePersonTransaction = await sequelize.transaction();

    updateDetails.callDetails.callDate = currentTimestamp;
    updateDetails.callDetails.personId = personRecord.get('person_identifier');
    const callTransactionObject = await constructCallTransaction(updateDetails.callDetails, officerId, updatePersonTransaction);

    if(callTransactionObject.get('call_successful_indicator') === 'N') {
      updatePersonTransaction.commit();
      return;
    }


    if(updateDetails.transactionDetails.currentAddressChanged === 'Y' && updateDetails.transactionDetails.currentAddress) {
      const currentAddressRecord = await address.create(objectMapper(updateDetails.transactionDetails.currentAddress, AddressToDbMapper), { transaction: updatePersonTransaction });
      updateDetails.transactionDetails.currentAddress = currentAddressRecord.get('address_key')
    } else {
      updateDetails.transactionDetails.currentAddress = personRecord.get('current_address_key');
    }

    if(updateDetails.basicDetails) {
      if(updateDetails.basicDetails.addressChanged === 'Y' && updateDetails.basicDetails.address) {
        const addressRecord = await address.create(objectMapper(updateDetails.basicDetails.address, AddressToDbMapper), { transaction: updatePersonTransaction });
        updateDetails.basicDetails.address = addressRecord.get('address_key')
      } else {
        updateDetails.basicDetails.address = personRecord.get('permanent_address_key');
      }

      updateDetails.basicDetails.currentAddress = updateDetails.transactionDetails.currentAddress;
      updateDetails.basicDetails.dateOfArraival && (updateDetails.basicDetails.dateOfArraival =   moment(updateDetails.basicDetails.dateOfArraival, 'DD-MM-YYYY'));


      const staticMap = {
        phone_number_valid: 'Y',
        person_status: PERSON_STATUS.CLOSED,
        updatedby: officerId,
      };
      const basicDetailDbObject = {
        ...objectMapper(updateDetails.basicDetails, BasicDetailDbMapper),
        ...staticMap
      };

      for (let key in basicDetailDbObject) {
        personRecord[key] = basicDetailDbObject[key]
      }


      await personRecord.save({ transaction: updatePersonTransaction });
    }

    updateDetails.transactionDetails.callId = callTransactionObject.get('call_id');
    updateDetails.transactionDetails.callDate = currentTimestamp;
    updateDetails.transactionDetails.personId = personRecord.get('person_identifier');
    updateDetails.transactionDetails.address = updateDetails.transactionDetails.currentAddress;
    await constructPersonCallTransaction(updateDetails.transactionDetails, officerId, updatePersonTransaction);

    if(updateDetails.contractedPersons)
      await constructPersonContractedDetails(updateDetails.contractedPersons, personRecord.person_identifier, officerId, updatePersonTransaction, currentTimestamp);
    if(updateDetails.travelDetails)
      await constructPersonTravelDetails(updateDetails.travelDetails, personRecord.person_identifier, updatePersonTransaction);

    updatePersonTransaction.commit();


  } catch (e) {
    if (updatePersonTransaction)
      updatePersonTransaction.rollback();
    throw e;

  }
};


const constructPersonDetails = async (basicDetails, staticMap, transaction) => {
  if (basicDetails.address && basicDetails.currentAddress) {
    const addressArray = [basicDetails.address, basicDetails.currentAddress];
    const addressRecord = await address.bulkCreate(
      addressArray.map(addressData => objectMapper(addressData, AddressToDbMapper)),
      { transaction });
    basicDetails.address = addressRecord[0].get('address_key');
    basicDetails.currentAddress = addressRecord[1].get('address_key');
  } else if(basicDetails.address) {
    const addressRecord = await address.create(objectMapper(basicDetails.address, AddressToDbMapper), { transaction });
    basicDetails.address = addressRecord.get('address_key');
    basicDetails.currentAddress = addressRecord.get('address_key');
  }
  basicDetails.dateOfArraival && (basicDetails.dateOfArraival =   moment(basicDetails.dateOfArraival, 'DD-MM-YYYY'));
  const basicDetailDbObject = {
    ...objectMapper(basicDetails, BasicDetailDbMapper),
    ...staticMap
  };
  return await personDetails.create(basicDetailDbObject, { transaction });
};
const constructCallTransaction = async (callDetails, userId, transaction) => {
  const callDetailDbObject = {
    call_date: callDetails.callDate,
    person_id: callDetails.personId,
    phone_number_dialed: callDetails.phoneNumber,
    doctor_or_medical_officer_id: userId,
    call_successful_indicator: callDetails.callSuccessfulIndicator || 'Y',
    wrong_number_indicator: callDetails.wrongNumberIndicator || 'N',
    call_not_responding_indicator: callDetails.callNotRespondingIndicator || 'N',
    incorrect_phone_number: callDetails.incorrectPhoneNumber || 'N',
    answered_by: callDetails.answeredBy,
    suspected_flag: callDetails.isSuspected,
    inbound_or_outbound: callDetails.inboundOrOutbound || CALL_TYPE.IN,
  };


  return await callTransaction.create(callDetailDbObject, { transaction });
};
const constructPersonCallTransaction = async (transactionDetails, userId, transaction) => {
  transactionDetails.dateOfAdmission && (transactionDetails.dateOfAdmission =   moment(transactionDetails.dateOfAdmission, 'DD-MM-YYYY'));
  transactionDetails.testedPositiveOn && (transactionDetails.testedPositiveOn =   moment(transactionDetails.testedPositiveOn, 'DD-MM-YYYY'));
  transactionDetails.testedNegativeOn && (transactionDetails.testedNegativeOn =   moment(transactionDetails.testedNegativeOn, 'DD-MM-YYYY'));
  transactionDetails.dateOfDischarge && (transactionDetails.dateOfDischarge =   moment(transactionDetails.dateOfDischarge, 'DD-MM-YYYY'));
  transactionDetails.dateOfFirstSymptom && (transactionDetails.dateOfFirstSymptom =   moment(transactionDetails.dateOfFirstSymptom, 'DD-MM-YYYY'));
  return await personCallTransaction.create(objectMapper(transactionDetails, PersonCallDetailDbMapper), { transaction });
};
const constructPersonTravelDetails = (travelDetailsArray, personId, transaction) => {
  return Promise.map(travelDetailsArray, async (travelDetails) => {
    travelDetails.personId = personId;
    const addressRecord = await address.create(objectMapper(travelDetails.address, AddressToDbMapper), {transaction});
    travelDetails.address = addressRecord.get('address_key');
    travelDetails.visitedDate = moment(travelDetails.visitedDate, 'DD-MM-YYYY HH:mm');
    return await personTravelDetails.create(objectMapper(travelDetails, TravelDetailToDbMapper), {transaction});
  });
};
const constructPersonContractedDetails = (contractedPersonsArray, personId, userId, transaction, currentTimestamp) => {
  return Promise.map(contractedPersonsArray, async (contractDetails) => {
    const contractStaticMap = {
      person_status: PERSON_STATUS.OPEN,
      createdby: userId,
      updatedby: userId,
      contractedby: personId,
      createdAt: currentTimestamp
    };
    await constructPersonDetails(contractDetails, contractStaticMap, transaction)
  });
};

module.exports = {
  createPerson,
  getHospitals,
  getLocation,
  getPerson,
  isPersonExist,
  updatePerson
};
