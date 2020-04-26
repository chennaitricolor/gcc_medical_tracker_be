const BasicDetailDbMapper = {
  name: 'name',
  age: 'age',
  gender: 'gender',
  passport: 'passport_no',
  phoneNumber: 'phone_number',
  secondaryPhoneNumber: 'secondary_phone_number',
  travelledAbroad: 'travel_history_indicator',
  countryVisited: 'country_visited',
  dateOfArraival: 'date_of_arrival',
  remarks: 'remarks',
  familyMembersCount: 'number_of_family_members',
  diabetesIndicator: 'diabetes_indicator',
  hyperTensionIndicator: 'hypertension_indicator',
  otherIllness: 'other_illness',
  phoneNumberValid: 'phone_number_valid',
  personStatus: 'person_status',
  address: 'permanent_address_key',
  currentAddress: 'current_address_key',
  contractedby: 'contractedby',
  createdAt: 'createdAt',
};

const AddressToDbMapper = {
  type: 'building_type',
  numberAndFloor: 'flat_building_no_and_floor',
  street: 'street_name',
  addressMeta: 'address_line_2',
  area: 'area',
  city: 'city_or_district',
  state: 'state',
  pinCode: 'pin_code',
  locationId: 'location_id',
};

const PersonCallDetailDbMapper = {
  personId: 'person_identifier',
  callId: 'call_id',
  callDate: 'call_date',
  address: 'current_address_key',
  healthStatus: 'person_status',
  attenderName: 'attender_name',
  attenderNumber: 'attender_phone_number',
  symptoms: 'symptoms',
  dateOfFirstSymptom: 'date_of_first_symptom',
  dateOfAdmission: 'date_admitted_in_hospital',
  hospitalId: 'hospital_id',
  testedPositiveOn: 'tested_positive',
  testedNegativeOn: 'tested_negative',
  dateOfDischarge: 'date_of_discharge',
};

const TravelDetailToDbMapper = {
  placeOfVisit: 'place_of_visit',
  placeType: 'place_type',
  address: 'address_key',
  personId: 'person_identifier',
  visitedDate: 'date_and_time_of_travel',
  modeOfTravel: 'mode_of_travel',
};

const objectMapper = (source={}, mapper) => {
  const resultObject = {};
  Object.keys(source).forEach(key => {
    if (mapper[key]) {
      resultObject[mapper[key]] = source[key]
    }
  });
  return resultObject;
}


module.exports = {
  AddressToDbMapper,
  BasicDetailDbMapper,
  PersonCallDetailDbMapper,
  TravelDetailToDbMapper,
  objectMapper
};