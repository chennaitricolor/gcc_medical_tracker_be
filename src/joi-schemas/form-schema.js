let Joi = require('joi');
const joiPhoneNumber = require('joi-phone-number');
const joiDateExtension = require('joi-date-extensions');

const phoneJoi = Joi.extend(joiPhoneNumber);
const {
  ANSWERED_BY, BUILDING_TYPE, LOCATION_TYPES, HEALTH_STATUS, PLACE_TYPE, MODE_OF_TRAVEL, CALL_TYPE
} = require('../constants');

const addressJoi = Joi.object({
  type: Joi.string().only(BUILDING_TYPE).required(),
  numberAndFloor: Joi.string().required(),
  street: Joi.string().required(),
  addressMeta: Joi.string(),
  area: Joi.string().required(),
  city: Joi.string().default('Chennai'),
  state: Joi.string().default('Tamil Nadu'),
  pinCode: Joi.number().required(),
  locationId: Joi.number().required()
});

Joi = Joi.extend(joiDateExtension);


module.exports = {
  hospitals: Joi.object({
    name: Joi.string(),
    offset: Joi.number().default(0)
  }),
  location: Joi.object({
    street_name: Joi.string(),
    area: Joi.string(),
    location: Joi.string(),
    ward: Joi.number(),
    zone: Joi.number()
  }),
  locationType: Joi.object({
    type: Joi.string().only(LOCATION_TYPES)
  }),
  person: Joi.object({
    callDetails: Joi.object({
      phoneNumber: phoneJoi.string().phoneNumber({ defaultCountry: 'IN', strict: true }).required(),
      answeredBy: Joi.string().only(ANSWERED_BY),
      isSuspected: Joi.string().only('Y', 'N').required(),
    }).required(),
    basicDetails: Joi.object({
      name: Joi.string().required(),
      age: Joi.number().required(),
      address: addressJoi.required(),
      gender: Joi.string().only('M', 'F').required(),
      passport: Joi.string(),
      phoneNumber: phoneJoi.string().phoneNumber({ defaultCountry: 'IN', strict: true }).required(),
      secondaryPhoneNumber: phoneJoi.string().phoneNumber({ defaultCountry: 'IN', strict: true }),
      travelledAbroad: Joi.string().only('Y', 'N').required(),
      remarks: Joi.string(),
      familyMembersCount: Joi.number().required(),
      diabetesIndicator: Joi.string().only('Y', 'N').required(),
      hyperTensionIndicator: Joi.string().only('Y', 'N').required(),
      otherIllness: Joi.string()
    }).when(Joi.object({ travelledAbroad: 'Y' }).unknown(), {
      then: Joi.object({
        countryVisited: Joi.string().required(),
        dateOfArraival: Joi.date().format('DD-MM-YYYY').raw().required()
      })
    }).required(),
    transactionDetails: Joi.object({
      currentAddressSame: Joi.string().only('Y', 'N').required(),
      currentAddress: addressJoi.required(),
      healthStatus: Joi.string().only(HEALTH_STATUS).required(),
      attenderName: Joi.string(),
      symptoms: Joi.string(),
      dateOfFirstSymptom: Joi.date().format('DD-MM-YYYY').raw(),
      hospitalId: Joi.number(),
      dateOfAdmission: Joi.date().format('DD-MM-YYYY').raw(),
      testedPositiveOn: Joi.date().format('DD-MM-YYYY').raw(),
      testedNegativeOn: Joi.date().format('DD-MM-YYYY').raw(),
      dateOfDischarge: Joi.date().format('DD-MM-YYYY').raw(),
    }).when(Joi.object({ attenderName: Joi.string().required() }).unknown(), {
      then: Joi.object({
        attenderNumber: phoneJoi.string().phoneNumber({ defaultCountry: 'IN', strict: true }).required(),
      })
    }).required(),
    travelDetails: Joi.array().items(
      Joi.object({
        placeOfVisit: Joi.string().required(),
        placeType: Joi.string().only(PLACE_TYPE).required(),
        address: addressJoi.required(),
        visitedDate: Joi.date().format('DD-MM-YYYY HH:mm').raw().required(),
        modeOfTravel: Joi.string().only(MODE_OF_TRAVEL).required()
      }).required()
    ),
    contractedPersons: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required(),
        gender: Joi.string().only('M', 'F').required(),
        phoneNumber: phoneJoi.string().phoneNumber({ defaultCountry: 'IN', strict: true }).required(),
        secondaryPhoneNumber: phoneJoi.string().phoneNumber({ defaultCountry: 'IN', strict: true }),
      }).required()
    )
  }),
  updatePerson: Joi.object({
    callDetails: Joi.object({
      callSuccessfulIndicator: Joi.string().only('Y', 'N').required(),
      wrongNumberIndicator: Joi.string().only('Y', 'N').required(),
      callNotRespondingIndicator: Joi.string().only('Y', 'N').required(),
      incorrectPhoneNumber: Joi.string().only('Y', 'N').required(),
      inboundOrOutbound: Joi.string().only(Object.values(CALL_TYPE)).required(),
      phoneNumber: phoneJoi.string().phoneNumber({ defaultCountry: 'IN', strict: true }).required(),
      answeredBy: Joi.string().only(ANSWERED_BY),
      isSuspected: Joi.string().only('Y', 'N').required(),
    }).required(),
    basicDetails: Joi.object({
      name: Joi.string(),
      addressChanged: Joi.string().only('Y', 'N').required(),
      address: addressJoi,
      age: Joi.number(),
      gender: Joi.string().only('M', 'F'),
      passport: Joi.string(),
      phoneNumber: phoneJoi.string().phoneNumber({ defaultCountry: 'IN', strict: true }),
      secondaryPhoneNumber: phoneJoi.string().phoneNumber({ defaultCountry: 'IN', strict: true }),
      travelledAbroad: Joi.string().only('Y', 'N'),
      remarks: Joi.string(),
      familyMembersCount: Joi.number(),
      diabetesIndicator: Joi.string().only('Y', 'N'),
      hyperTensionIndicator: Joi.string().only('Y', 'N'),
      otherIllness: Joi.string()
    }).when(Joi.object({ travelledAbroad: 'Y' }).unknown(), {
      then: Joi.object({
        countryVisited: Joi.string().required(),
        dateOfArraival: Joi.date().format('DD-MM-YYYY').raw().required()
      })
    }),
    transactionDetails: Joi.object({
      currentAddressChanged: Joi.string().only('Y', 'N').required(),
      currentAddress: addressJoi.required(),
      healthStatus: Joi.string().only(HEALTH_STATUS).required(),
      attenderName: Joi.string(),
      symptoms: Joi.string(),
      dateOfFirstSymptom: Joi.date().format('DD-MM-YYYY').raw(),
      hospitalId: Joi.number(),
      dateOfAdmission: Joi.date().format('DD-MM-YYYY').raw(),
      testedPositiveOn: Joi.date().format('DD-MM-YYYY').raw(),
      testedNegativeOn: Joi.date().format('DD-MM-YYYY').raw(),
      dateOfDischarge: Joi.date().format('DD-MM-YYYY').raw(),
    }).when(Joi.object({ attenderName: Joi.string().required() }).unknown(), {
      then: Joi.object({
        attenderNumber: phoneJoi.string().phoneNumber({ defaultCountry: 'IN', strict: true }).required(),
      })
    }).required(),
    travelDetails: Joi.array().items(
      Joi.object({
        placeOfVisit: Joi.string().required(),
        placeType: Joi.string().only(PLACE_TYPE).required(),
        address: addressJoi.required(),
        visitedDate: Joi.date().format('DD-MM-YYYY HH:mm').raw().required(),
        modeOfTravel: Joi.string().only(MODE_OF_TRAVEL).required()
      })
    ),
    contractedPersons: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required(),
        gender: Joi.string().only('M', 'F').required(),
        phoneNumber: phoneJoi.string().phoneNumber({ defaultCountry: 'IN', strict: true }).required(),
        secondaryPhoneNumber: phoneJoi.string().phoneNumber({ defaultCountry: 'IN', strict: true }),
        address: addressJoi.required()
      })
    )
  }),
  getPerson: Joi.object({
    id: Joi.number().required()
  }),
};
